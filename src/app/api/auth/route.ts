import { updateSessionWithTokens } from '@/app/lib/session-update';
import { API_BASE_URL } from '@/consts';
import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

interface JwtPayload {
	exp: number;
	id: number;
	email?: string;
	role?: string;
}

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();
		console.log('[API Login] Данные формы:', { email, password: '***' });

		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
			cache: 'no-store',
		});

		if (!response.ok) {
			const error = await response.json();
			console.error('[API Login] Ошибка авторизации:', error);
			return NextResponse.json(
				{ error: error.message || 'Ошибка авторизации' },
				{ status: response.status },
			);
		}

		// Receive access and refresh tokens
		const { accessToken, refreshToken } = await response.json();

		// Decode the access token to get expiration time and user ID
		const decodedToken = jwtDecode<JwtPayload>(accessToken);
		const userId = decodedToken.id;
		const role = decodedToken.role || 'user';

		console.log('[API Login] Декодированный токен:', decodedToken);
		console.log(
			'[API Login] Время истечения:',
			new Date(decodedToken.exp * 1000).toLocaleString(),
		);

		// ✅ Используем централизованную функцию вместо ручного сохранения
		await updateSessionWithTokens(
			{ accessToken, refreshToken },
			{
				isLoggedIn: true,
				userId,
				role,
				lastChecked: Date.now(),
			},
		);

		console.log('[API Login] Сессия сохранена успешно');

		return NextResponse.json({
			success: true,
			message: 'Авторизация успешна',
		});
	} catch (error) {
		console.error('[API Login] Ошибка:', error);
		return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
	}
}
