import { API_BASE_URL } from '@/consts';
import { HttpMethod } from './types';

export const CONFIG = {
	API_BASE_URL: API_BASE_URL,
	TOKEN_REFRESH_BUFFER_PERCENT: 0.1, // 10% from token lifespan
	METHODS_WITH_BODY: ['POST', 'PUT', 'PATCH', 'DELETE'] as const satisfies readonly HttpMethod[],
	TIME_IN: {
		Ms: (n: number) => n * 1000,
		Sec: (n: number) => n,
		Min: (n: number) => n * 60,
		Hr: (n: number) => n * 3600,
		Days: (n: number) => n * 86400,
	},
} as const;

console.log('CONFIG.API_BASE_URL:', CONFIG.API_BASE_URL);
