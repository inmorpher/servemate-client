'use server';

import { apiAction } from './testWrapper';

export async function getUserData() {
	return await apiAction({
		endpoint: '/auth/me',
		method: 'GET',
		requiresAuth: true,
	});
}
