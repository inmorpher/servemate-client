import { NextRequest } from 'next/server';
import { CONFIG } from './config';
import { HttpMethod } from './types';

function isMethodWithBody(method: string): method is HttpMethod {
	return CONFIG.METHODS_WITH_BODY.includes(method as HttpMethod);
}

export async function buildServiceRequest(
	request: NextRequest,
	pathParams: string[],
	accessToken: string
) {
	const url = new URL(request.url);
	const queryParams = url.searchParams.toString();
	const apiPath = pathParams.join('/');
	const serviceUrl = `${CONFIG.API_BASE_URL}/${apiPath}${queryParams ? `?${queryParams}` : ''}`;

	const headers = new Headers(request.headers);
	headers.set('Authorization', `Bearer ${accessToken}`);

	// Очищаем проблематичные заголовки
	['host', 'content-length'].forEach((header) => headers.delete(header));

	const rawBody = isMethodWithBody(request.method) ? await request.text() : undefined;
	const body = rawBody && rawBody.trim().length > 0 ? rawBody : undefined;

	return { serviceUrl, headers, body };
}
