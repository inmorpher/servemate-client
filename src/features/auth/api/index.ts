import { api } from '@/shared/api/instance';

/**
 * @module authActions
 * Provides asynchronous functions for user authentication actions such as login and logout.
 */
export const authActions = {
	//Login
	login: async (email: string, password: string) => {
		try {
			const response = await api.post('/auth/login', {
				email,
				password,
			});
			console.log('Login response:', response.data);
			return response.data;
		} catch (error) {
			console.error('Authentication error:', error);
			throw new Error('Authentication error');
		}
	},
	// Logout
	logout: async () => {
		try {
			await api.post('/auth/logout');
		} catch (error) {
			console.error('Logout error:', error);
			throw new Error('Logout error');
		}
	},
};
