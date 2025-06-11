import { getSession } from '@/app/lib/session';
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
		const tokenData = await refreshToken(session.refreshToken);

		session.accessToken = tokenData.accessToken;
		session.refreshToken = tokenData.refreshToken;
		await session.save();

		return tokenData;
	} catch (error) {
		console.error('❌ [API] Ошибка обновления токена:', error);
		throw new ApiError('Token refresh failed', 401, true);
	}
}

async function refreshToken(refreshToken: string): Promise<TokenResponse> {
	const response = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh-token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refreshToken }),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('❌ [API] Ошибка refresh token:', {
			status: response.status,
			statusText: response.statusText,
			body: errorText,
		});
		throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
	}

	return await response.json();
}
