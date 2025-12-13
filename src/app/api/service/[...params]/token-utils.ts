import { getSession } from '@/app/lib/session';
import { updateSessionWithTokens } from '@/app/lib/session-update';
import { jwtDecode } from 'jwt-decode';
import { CONFIG } from './config';
import { ApiError } from './errors';
import { DecodedToken, SessionData, TokenResponse } from './types';

let refreshTokenPromise: Promise<TokenResponse> | null = null;

export async function getValidatedTokenFromSession(): Promise<TokenResponse> {
	try {
		console.log('🔍 [middleware] Проверка токена в сессии');
		const session = (await getSession()) as SessionData;

		if (!session?.refreshToken || !session?.accessToken) {
			console.error('❌ [API] Сессия не найдена или нет токенов');
			throw new ApiError('Unauthorized: No session or token found', 401, true);
		}

		const now = Math.floor(Date.now() / 1000);
		const decodedToken = jwtDecode<DecodedToken>(session.accessToken);

		if (!decodedToken.exp || !decodedToken.iat) {
			throw new ApiError('Invalid token format', 401, true);
		}

		const tokenLifeTime = decodedToken.exp - decodedToken.iat;
		const refreshBuffer = Math.floor(tokenLifeTime * CONFIG.TOKEN_REFRESH_BUFFER_PERCENT);
		const isTokenExpiringSoon = decodedToken.exp - refreshBuffer <= now;

		if (isTokenExpiringSoon) {
			return await handleTokenRefresh(session);
		}

		return {
			accessToken: session.accessToken,
			refreshToken: session.refreshToken,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError('Token validation failed', 500);
	}
}

async function handleTokenRefresh(session: SessionData): Promise<TokenResponse> {
	if (refreshTokenPromise) {
		return await refreshTokenPromise;
	}

	refreshTokenPromise = refreshTokenInternal(session);

	try {
		return await refreshTokenPromise;
	} finally {
		refreshTokenPromise = null;
	}
}

async function refreshTokenInternal(session: SessionData): Promise<TokenResponse> {
	try {
		const response = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh-token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken: session.refreshToken }),
		});

		if (!response.ok) throw new Error(`Refresh failed: ${response.status}`);

		const tokenData = await response.json();

		// ✅ Используем централизованную функцию вместо дублирования логики
		await updateSessionWithTokens(tokenData as TokenResponse);

		return tokenData;
	} catch (error) {
		console.error('❌ [API] Ошибка обновления токена:', error);
		throw new ApiError('Token refresh failed', 401, true);
	}
}

export async function forceRefreshToken(): Promise<TokenResponse> {
	try {
		const session = (await getSession()) as SessionData;

		if (!session?.refreshToken) {
			throw new ApiError('No refresh token available', 401, true);
		}

		// ✅ Переиспользуем существующий метод
		return await refreshTokenInternal(session);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError('Force refresh failed', 401, true);
	}
}
