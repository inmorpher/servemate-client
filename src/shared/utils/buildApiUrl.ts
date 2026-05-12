import { API_BASE_URL } from '@/consts';

const BASE_URL = `${API_BASE_URL}`;

export const buildApiUrl = (endpoint: string, params: Record<string, unknown> = {}): string => {
	const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

	let url = `/api/service${normalizedEndpoint}`;

	if (params && Object.keys(params).length > 0) {
		const queryParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			// Only add non-null, non-undefined, non-empty values
			if (value !== undefined && value !== null && value !== '') {
				queryParams.append(key, String(value));
			}
		});
		url += `?${queryParams.toString()}`;
	}

	return url;
};
