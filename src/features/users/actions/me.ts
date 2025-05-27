import { apiAction } from '@/shared/api/testWrapper';

export async function me() {
	const user = await apiAction({
		method: 'GET',
		endpoint: '/users/me',
		requiresAuth: true,
	});

	console.log('[meAction] Получаем данные пользователя:', user);
}
