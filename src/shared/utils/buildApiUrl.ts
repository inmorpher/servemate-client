const BASE_URL = '/api/service';

export const buildApiUrl = (endpoint: string, params: Record<string, unknown> = {}): string => {
	const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

	let url = `${BASE_URL}${normalizedEndpoint}`;

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

	console.log('test buildApiUrl', url);

	return url;
};
