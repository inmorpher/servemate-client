'use client';

import { getSession } from '@/app/lib/session';

interface ApiRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown> | null;
	requiresAuth?: boolean;
	endpoint: string;
}

class ApiClient {
	private baseUrl = 'http://192.168.2.60:3002/api';
	private isRefreshing = false;
	private refreshPromise: Promise<string> | null = null;

	private async getAuthHeaders(): Promise<Record<string, string>> {
		const session = await getSession();

		if (!session?.accessToken) {
			throw new Error('Требуется авторизация');
		}

		return {
			Authorization: `Bearer ${session.accessToken}`,
			'Content-Type': 'application/json',
		};
	}

	private async refreshToken(): Promise<string> {
		// Предотвращаем множественные одновременные запросы на refresh
		if (this.isRefreshing && this.refreshPromise) {
			return this.refreshPromise;
		}

		this.isRefreshing = true;
		this.refreshPromise = this.performRefresh();

		try {
			const newToken = await this.refreshPromise;
			return newToken;
		} finally {
			this.isRefreshing = false;
			this.refreshPromise = null;
		}
	}

	private async performRefresh(): Promise<string> {
		const session = await getSession();

		if (!session?.refreshToken) {
			throw new Error('Нет refresh токена');
		}

		const response = await fetch('/api/refresh', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken: session.refreshToken }),
		});

		if (!response.ok) {
			throw new Error('Не удалось обновить токен');
		}

		const { accessToken } = await response.json();
		return accessToken;
	}

	private async makeRequest(url: string, options: RequestInit): Promise<Response> {
		const response = await fetch(url, options);

		// Если 401 - пытаемся обновить токен и повторить запрос
		if (response.status === 401 && options.headers?.['Authorization']) {
			console.log('Получили 401, обновляем токен...');

			try {
				const newToken = await this.refreshToken();

				// Обновляем заголовки с новым токеном
				const updatedOptions = {
					...options,
					headers: {
						...options.headers,
						Authorization: `Bearer ${newToken}`,
					},
				};

				console.log('Повторяем запрос с новым токеном');
				return fetch(url, updatedOptions);
			} catch (refreshError) {
				console.error('Ошибка обновления токена:', refreshError);
				throw new Error('Требуется повторная авторизация');
			}
		}

		return response;
	}

	async request<T = unknown>({
		method = 'GET',
		body = null,
		requiresAuth = true,
		endpoint,
	}: ApiRequestOptions): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		let headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};

		if (requiresAuth) {
			const authHeaders = await this.getAuthHeaders();
			headers = { ...headers, ...authHeaders };
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
			const response = await this.makeRequest(url, requestOptions);

			if (!response.ok) {
				const error = await response.json().catch(() => ({
					message: `HTTP ${response.status}`,
				}));
				throw new Error(error.message || `HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Ошибка API запроса:', error);
			throw error;
		}
	}
}

// Создаем единственный экземпляр клиента
export const apiClient = new ApiClient();

// Экспортируем удобную функцию для обратной совместимости
export const apiAction = apiClient.request.bind(apiClient);
