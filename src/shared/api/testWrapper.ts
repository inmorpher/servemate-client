'use server';

import { getSession } from '@/app/lib/session';
import { refreshTokenAction } from './refreshToken';

interface ApiRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown> | null;
	requiresAuth?: boolean;
	endpoint: string;
}

export async function apiAction<T = unknown>({
	method = 'GET',
	body = null,
	requiresAuth = true,
	endpoint,
}: ApiRequestOptions): Promise<T> {
	const baseUrl = 'http://192.168.2.60:3002/api';
	const url = `${baseUrl}${endpoint}`;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (requiresAuth) {
		// Получаем сессию
		const session = await getSession();

		if (!session || !session.accessToken) {
			console.error('Нет сессии или accessToken');
			throw new Error('Требуется авторизация');
		}

		const now = Date.now();
		const tokenExpired = now >= session.expiresAt * 1000;
		const needsRefresh = !!session.needsRefresh;

		// Добавляем авторизацию по умолчанию
		headers['Authorization'] = `Bearer ${session.accessToken}`;

		if (needsRefresh || tokenExpired) {
			console.log('Токен требует обновления, запускаем обновление');
			try {
				// Обновляем токен с помощью server action
				const { accessToken, refreshToken } = await refreshTokenAction(session.refreshToken);

				session.accessToken = accessToken;
				session.refreshToken = refreshToken;

				// Обновляем заголовок с новым токеном
				headers['Authorization'] = `Bearer ${accessToken}`;

				await session.save(); // Сохраняем обновленную сессию

				console.log('Токен успешно обновлен и использован в заголовке');
			} catch (error) {
				console.error('Ошибка обновления токена:', error);
				// Используем уже установленный токен (по умолчанию)
			}
		}
	}

	const requestOptions: RequestInit = {
		method,
		headers,
		cache: 'no-store',
	};

	if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
		requestOptions.body = JSON.stringify(body);
	}

	try {
		const response = await fetch(url, requestOptions);
		if (!response.ok) {
			const error = await response.json();
			console.error('Ошибка API:', error);
			throw new Error(error.message || 'Ошибка API');
		}

		return await response.json();
	} catch (error) {
		console.error('Ошибка при выполнении запроса:', error);
		throw error;
	}
}
