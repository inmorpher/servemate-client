'use server';
import { getSession } from '@/app/lib/session';
import { API_BASE_URL } from '@/consts';

export async function checkAndRefreshToken(): Promise<boolean> {
	const session = await getSession();

	// Если пользователь не авторизован
	if (!session.isLoggedIn || !session.accessToken) {
		return false;
	}

	const timeToExpire = session.expiresAt;

	console.log('expiresAt', timeToExpire > Date.now());

	// Проверяем необходимость обновления токена
	// 1. По флагу needsRefresh (установлен в middleware)
	// 2. По времени истечения (если осталось менее 5 минут)
	const needsRefresh =
		session.needsRefresh || (timeToExpire && timeToExpire < Date.now() + 5 * 60 * 1000);

	if (needsRefresh) {
		console.log('[apiClient] Токен требует обновления, запускаем обновление');
	}

	console.log('[apiClient] Проверяем токен на необходимость обновления:');

	console.log('проверочно обновляем токен');

	const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			refreshToken: session.refreshToken,
		}),
		cache: 'no-store',
	});

	if (!response.ok) {
		console.error('[apiClient] Ошибка обновления токена:', response.statusText);
	}

	const data = await response.json();

	console.log(data.accessToken === session.accessToken ? 'токен не обновился' : 'токен обновился');

	session.accessToken = data.accessToken;
	session.refreshToken = data.refreshToken;
	session.expiresAt = data.expiresIn && data.expiresIn;
	session.isLoggedIn = true;
	session.needsRefresh = false; // Сбрасываем флаг необходимости обновления
	session.lastChecked = Date.now(); // Обновляем время последней проверки токена
	await session.save();
	console.log('[apiClient] Сессия обновлена:', session);

	// Токен действителен и не требует обновления
	return true;
}
