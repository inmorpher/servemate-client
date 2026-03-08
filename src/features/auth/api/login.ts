'use server';

import { getSession } from '@/app/lib/session';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ILoginFormInputs } from '../actions/login';

interface JwtPayload {
	exp: number;
	id: number;
	email?: string;
	role?: string;
}

export async function login(formData: ILoginFormInputs) {
	try {
		const { email, password } = formData;
		console.log('[loginAction] Данные формы:', { email, password: '***' });

		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
			cache: 'no-store',
		});

		if (!response.ok) {
			const error = await response.json();
			console.error('[loginAction] Ошибка авторизации:', error);
			throw new Error(error.message || 'Ошибка авторизации');
		}

		// Receive access and refresh tokens
		const { accessToken, refreshToken } = await response.json();

		// Decode the access token to get expiration time and user ID
		const decodedToken = jwtDecode<JwtPayload>(accessToken);
		const expiresAt = decodedToken.exp; // Переводим в миллисекунды
		const userId = decodedToken.id;
		const role = decodedToken.role || 'user';

		console.log('[loginAction] Декодированный токен:', decodedToken);
		console.log('[loginAction] Время истечения токена:', expiresAt);
		console.log('[loginAction] , expiresAt:', new Date(expiresAt * 1000).toLocaleString());

		console.log(
			'[loginAction] Токен успешно получен, срок действия до:',
			new Date(expiresAt * 1000).toLocaleString(),
		);

		// Get session and update it
		const session = await getSession();
		session.accessToken = accessToken;
		session.refreshToken = refreshToken;
		session.expiresAt = expiresAt; // Устанавливаем время истечения токена
		session.isLoggedIn = true;
		session.userId = userId;
		session.role = role;
		session.lastChecked = Date.now(); // Добавляем время последней проверки токена

		// Save session
		await session.save();

		const cookieStore = await cookies();
		const savedCookie = cookieStore.get('servemate-session');
		console.log('[loginAction] Кука после сохранения:', {
			exists: !!savedCookie,
			value: savedCookie?.value?.substring(0, 50) + '...',
		});

		//Redirect to dashboard
		redirect('/account');
	} catch (error) {
		console.error('[loginAction] Ошибка:', error);
		throw error instanceof Error ? error : new Error('Неизвестная ошибка при входе');
	}
}
