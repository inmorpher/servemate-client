import { useAuth } from '@/providers/AuthProvider';
import { setupTokenRefreshTimer } from '@/shared/api/instance';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authActions } from '../../../shared/api/authAction';

/**
 * @interface IUseLogin
 * @description Interface for the useLogin hook.
 */
interface IUseLogin {
	/**
	 * @function login
	 * @description Function to log in a user.
	 * @param {string} email - The user's email.
	 * @param {string} password - The user's password.
	 * @returns {Promise<void>}
	 */
	login: (email: string, password: string) => Promise<void>;
	/**
	 * @property {boolean} isLoading
	 * @description Indicates whether the login process is currently loading.
	 */
	isLoading: boolean;
	/**
	 * @property {string | null} error
	 * @description Contains the error message if the login process failed, otherwise null.
	 */
	error: string | null;
	/**
	 * @property {boolean} isAuth
	 * @description Indicates whether the user is currently authenticated.
	 */
	isAuth: boolean;
}

/**
 * Custom hook for handling user login.
 * @returns {IUseLogin} An object containing the login function, loading state, error message, and authentication status.
 * The returned object has the following structure:
 *   - `login`: A function that takes an email and password as arguments and attempts to log in the user.
 *   - `isLoading`: A boolean indicating whether the login process is currently in progress.
 *   - `error`: A string or null value representing any error message that occurred during the login process.
 *   - `isAuth`: A boolean indicating whether the user is currently authenticated.
 */
export const useLogin = (): IUseLogin => {
	const { isAuth, setIsAuth, setExpiredIn } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		setError(null);
		console.log('Login attempt with email:', email);
		try {
			const res = await authActions.login(email, password);
			setIsAuth(true);
			setExpiredIn(res.expiresIn);

			setupTokenRefreshTimer();

			router.push('/dashboard');
		} catch (error) {
			console.error(error);
			setError('Wrong email or password');
		} finally {
			setIsLoading(false);
		}
	};

	return { login, isLoading, error, isAuth };
};
