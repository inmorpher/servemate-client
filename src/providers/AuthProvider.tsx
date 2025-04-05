'use client';

import { api, cleanup, initApi, setupTokenRefreshTimer } from '@/shared/api/instance';
import { useRouter } from 'next/navigation';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

interface IAuthContext {
	isAuth: boolean;
	isLoading: boolean;
	accessToken: string | null;

	setIsLoading: (isLoading: boolean) => void;
	setAccessToken: (token: string | null) => void;
	setIsAuth: (isAuth: boolean) => void;
	refreshAccessToken: () => Promise<boolean>;
	setExpiredIn: (expiredIn: number) => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuth, setIsAuth] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const accessTokenExpiresIn = useRef<number | null>(null);
	const accessTokenRef = useRef<string | null>(null);
	const router = useRouter();
	const isInitialized = useRef(false);

	/**
	 * Retrieves the current access token.
	 */
	const getAccessToken = useCallback(() => accessTokenRef.current, []);

	/**
	 * Updates the current access token stored in the `accessTokenRef`.
	 */
	const setAccessToken = useCallback((token: string | null) => {
		accessTokenRef.current = token;
	}, []);

	/**
	 * Updates the expiration time for the access token.
	 */
	const setExpiredIn = useCallback((expiredIn: number) => {
		accessTokenExpiresIn.current = expiredIn;
	}, []);

	/**
	 * Retrieves the expiration time of the access token.
	 */
	const getExpiredIn = useCallback(() => {
		return accessTokenExpiresIn.current || 0;
	}, []);

	/**
	 * Refreshes the access token by making a POST request.
	 */
	const refreshAccessToken = useCallback(async () => {
		try {
			const res = await api.post(
				`/auth/refresh-token`,
				{},
				{
					withCredentials: true,
				}
			);

			setAccessToken(res.data.accessToken);
			setExpiredIn(res.data.expiresIn);
			setIsAuth(true);

			console.log(`Токен обновлен. Следующее обновление через ${getExpiredIn() * 0.9} секунд`);
			return true;
		} catch (error) {
			console.error('Error refreshing access token:', error);
			return false;
		}
	}, [getExpiredIn, setAccessToken, setExpiredIn]);

	// Initialize the API with authorization handlers
	useEffect(() => {
		// Initialize the API with the authorization handlers
		initApi({
			getAccessToken,
			refreshAccessToken,
			setAccessToken,
			setExpiredIn,
			setIsAuth,
			getExpiredIn,
		});

		// Очистка ресурсов при размонтировании
		return () => {
			cleanup();
		};
	}, [getAccessToken, refreshAccessToken, setAccessToken, setExpiredIn, getExpiredIn]);

	// Initialize the authentication state
	useEffect(() => {
		const initAuth = async () => {
			console.count('initAuth');

			if (isInitialized.current) {
				return;
			}

			if (window.location.pathname === '/login') {
				isInitialized.current = true;
				return;
			}

			setIsLoading(true);
			try {
				const success = await refreshAccessToken();
				console.log('refreshAccessToken', success);
				if (success) {
					setIsAuth(true);

					if (window.location.pathname === '/login') {
						router.push('/dashboard');
					}

					// Set up the token refresh timer
					setupTokenRefreshTimer();
				} else {
					console.log('Не удалось инициализировать авторизацию');
					setIsAuth(false);

					if (window.location.pathname.includes('/dashboard')) {
						router.push('/login');
					}
				}
			} catch (error) {
				console.error('Ошибка инициализации авторизации:', error);
				setIsAuth(false);
			} finally {
				setIsLoading(false);
				isInitialized.current = true;
			}
		};

		initAuth();
	}, [router, refreshAccessToken]);

	return (
		<AuthContext.Provider
			value={{
				isAuth,
				isLoading,
				accessToken: getAccessToken(),

				setIsLoading,
				setAccessToken,
				setIsAuth,
				setExpiredIn,
				refreshAccessToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
