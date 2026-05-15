import { buildApiUrl } from './buildApiUrl';

export type ApiResponseMode = 'auto' | 'json' | 'text' | 'void';

type ApiRequestOptions<TBody> = {
	method?: string;
	params?: Record<string, unknown>;
	body?: TBody;
	headers?: HeadersInit;
	responseMode?: ApiResponseMode;
};

const isJsonLikeBody = (body: unknown): body is Record<string, unknown> => {
	if (body === null || body === undefined) {
		return false;
	}

	return (
		typeof body === 'object' &&
		!(body instanceof FormData) &&
		!(body instanceof Blob) &&
		!(body instanceof URLSearchParams)
	);
};

export const apiRequest = async <TResponse = unknown, TBody = unknown>(
	endpoint: string,
	{ method = 'GET', params, body, headers, responseMode = 'auto' }: ApiRequestOptions<TBody> = {},
): Promise<TResponse> => {
	const url = buildApiUrl(endpoint, params);
	const requestHeaders = new Headers(headers);
	let requestBody: BodyInit | undefined;

	if (body !== undefined) {
		if (isJsonLikeBody(body)) {
			if (!requestHeaders.has('Content-Type')) {
				requestHeaders.set('Content-Type', 'application/json');
			}

			requestBody = JSON.stringify(body);
		} else {
			requestBody = body as BodyInit;
		}
	}

	const response = await fetch(url, {
		method,
		headers: requestHeaders,
		body: requestBody,
	});

	if (!response.ok) {
		const errorMessage = await response.text().catch(() => '');
		throw new Error(errorMessage || 'Failed to fetch data');
	}

	if (responseMode === 'void' || response.status === 204) {
		return null as TResponse;
	}

	if (responseMode === 'text') {
		return (await response.text()) as TResponse;
	}

	if (responseMode === 'json') {
		return (await response.json()) as TResponse;
	}

	const contentType = response.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		return (await response.json()) as TResponse;
	}

	if (contentType.startsWith('text/')) {
		return (await response.text()) as TResponse;
	}

	return (await response.text()) as TResponse;
};
