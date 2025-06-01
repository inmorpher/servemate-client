import { HttpMethod } from './types';

export const CONFIG = {
	API_BASE_URL: process.env.API_BASE_URL || 'http://192.168.2.60:3002/api',
	TOKEN_REFRESH_BUFFER_PERCENT: 0.1, // 10% от времени жизни токена
	METHODS_WITH_BODY: ['POST', 'PUT', 'PATCH', 'DELETE'] as const satisfies readonly HttpMethod[],
} as const;
