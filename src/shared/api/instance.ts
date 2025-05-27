// import axios, { AxiosRequestConfig } from 'axios';

// // AuthHandlers interface
// interface AuthHandlers {
// 	getAccessToken: () => string | null;
// 	refreshAccessToken: () => Promise<boolean>;

// 	setAccessToken: (token: string | null) => void;
// 	setExpiredIn: (expiresIn: number) => void;
// 	setIsAuth: (isAuth: boolean) => void;
// 	getExpiredIn: () => number;
// }

// // State and queue for token refresh
// let tokenRefreshTimeout: NodeJS.Timeout | null = null;
// let isRefreshing = false;
// let refreshTokenPromise: Promise<boolean> | null = null;
// let requestQueue: Array<{
// 	resolve: (value: unknown) => void;
// 	reject: (error: unknown) => void;
// 	config: AxiosRequestConfig;
// }> = [];

// // Create axios instance
// export const api = axios.create({
// 	baseURL: process.env.NEXT_PUBLIC_API_URL,
// 	withCredentials: true,
// });

// // Save handlers for auth actions
// let handlers: AuthHandlers | null = null;

// //Init instance with handlers
// export function initApi(authHandlers: AuthHandlers) {
// 	handlers = authHandlers;
// 	setupInterceptors();
// }

// // Set up token refresh timer
// export function setupTokenRefreshTimer() {
// 	if (!handlers) {
// 		return;
// 	}

// 	if (tokenRefreshTimeout) {
// 		// If timer is already set, clear it and set a new one
// 		clearTimeout(tokenRefreshTimeout);
// 	}

// 	// Get expiration time from handlers
// 	const expiresIn = handlers.getExpiredIn();

// 	// If expiration time is not set, do nothing
// 	if (expiresIn) {
// 		const expiresInMs = expiresIn * 1000;
// 		const refreshTime = expiresInMs * 0.9;

// 		console.log(`Установка таймера на ${refreshTime / 1000} секунд`);
// 		// Set a timeout to refresh the token
// 		tokenRefreshTimeout = setTimeout(async () => {
// 			console.log('Сработал таймер обновления токена');
// 			if (!handlers) {
// 				console.error('Обработчики авторизации не определены');
// 				return;
// 			}
// 			const success = await handlers.refreshAccessToken();
// 			if (success) {
// 				setupTokenRefreshTimer();
// 			}
// 		}, refreshTime);
// 	}
// }

// // Process request queue after token refresh
// // If token refresh is successful, resolve all requests in the queue
// function processQueue(success: boolean) {
// 	requestQueue.forEach((request) => {
// 		if (success && handlers) {
// 			const config = { ...request.config };
// 			config.headers = config.headers || {};
// 			config.headers.Authorization = `Bearer ${handlers.getAccessToken()}`;

// 			api(config)
// 				.then((response) => {
// 					request.resolve(response);
// 				})
// 				.catch((error) => {
// 					request.reject(error);
// 				});
// 		} else {
// 			request.reject(new Error('Token refresh failed'));
// 		}
// 	});
// 	requestQueue = [];
// }

// // Add request to the queue
// function addToQueue(config: AxiosRequestConfig) {
// 	return new Promise((resolve, reject) => {
// 		requestQueue.push({
// 			resolve,
// 			reject,
// 			config,
// 		});
// 	});
// }

// // Setup interceptors for axios instance
// function setupInterceptors() {
// 	if (!handlers) return;

// 	// Interceptor for requests
// 	api.interceptors.request.use((config) => {
// 		config.baseURL = process.env.NEXT_PUBLIC_API_URL;
// 		config.withCredentials = true;

// 		const token = handlers?.getAccessToken();
// 		if (token) {
// 			config.headers.Authorization = `Bearer ${token}`;
// 		}
// 		return config;
// 	});

// 	// Interceptor for responses
// 	api.interceptors.response.use(
// 		(response) => response,
// 		async (error) => {
// 			if (!handlers) return Promise.reject(error);

// 			const originalRequest = error.config;
// 			// Check if the error is due to an expired token
// 			if (error.response?.status === 401 && !originalRequest._retry) {
// 				// If the request has already been retried, return a rejected promise
// 				originalRequest._retry = true;

// 				// Check if a token refresh is already in progress
// 				if (isRefreshing) {
// 					try {
// 						// If a token refresh is in progress, wait for it to finish
// 						return await addToQueue(originalRequest);
// 					} catch (error) {
// 						// If the token refresh fails, reject the promise
// 						// handlers.logout();
// 						return Promise.reject(error);
// 					}
// 				}
// 				// If no token refresh is in progress, start a new one
// 				try {
// 					isRefreshing = true;
// 					refreshTokenPromise = handlers.refreshAccessToken();

// 					const success = await refreshTokenPromise;

// 					processQueue(success);
// 					isRefreshing = false;
// 					refreshTokenPromise = null;

// 					if (success) {
// 						// Update the original request with the new token
// 						const newRequest = { ...originalRequest };
// 						const token = handlers.getAccessToken();
// 						if (token) {
// 							newRequest.headers.Authorization = `Bearer ${token}`;
// 						}
// 						// Retry the original request with the new token
// 						return api(newRequest);
// 					} else {
// 						// If the token refresh fails, log out the user
// 						// await handlers.logout();
// 						return Promise.reject(error);
// 					}
// 				} catch (refreshError) {
// 					console.error('Error token update:', refreshError);
// 					isRefreshing = false;
// 					refreshTokenPromise = null;
// 					processQueue(false);
// 					// await handlers.logout();
// 					return Promise.reject(error);
// 				}
// 			}
// 			return Promise.reject(error);
// 		}
// 	);
// }

// // Cleanup function to clear the token refresh timer
// export function cleanup() {
// 	// Clear the token refresh timer if it exists
// 	if (tokenRefreshTimeout) {
// 		clearTimeout(tokenRefreshTimeout);
// 		tokenRefreshTimeout = null;
// 	}
// }
