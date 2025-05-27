'use server';

export async function refreshTokenAction(token: string): Promise<{
	accessToken: string;
	refreshToken: string;
}> {
	console.log('[refreshTokenAction] Обновление токена с помощью refreshToken:', {
		refreshToken: token,
	});
	try {
		console.log('[refreshTokenAction] Запрос на обновление токена:');
		const response = await fetch('http://localhost:3000/api/refresh/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refreshToken: token }),
			cache: 'no-store',
		});

		// if (!response.ok) {
		// 	const error = await response;
		// 	console.error('[refreshTokenAction] Ошибка обновления токена:', error);
		// 	throw new Error(error.message || 'Ошибка обновления токена');
		// }
		// console.log('res', respon);
		const data = await response.json();
		console.log('[refreshTokenAction] Получены новые токены:', {
			accessToken: data.accessToken ? '***' : undefined,
			refreshToken: data.refreshToken ? '***' : undefined,
		});

		// Сохраняем сессию

		console.log('[refreshTokenAction] Сессия успешно обновлена');

		// Возв{{ращаем только accessToken
		return {
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
		};
	} catch (error: unknown) {
		console.error('[refreshTokenAction] Ошибка:', error);
		// Проверяем тип ошибки и пробрасываем её дальше
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Неизвестная ошибка при обновлении токена');
	}
}
