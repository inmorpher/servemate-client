import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './errors';
import { buildServiceRequest } from './request-utils';
import { forceRefreshToken, getValidatedTokenFromSession } from './token-utils';

async function handler(
	request: NextRequest,
	{ params }: { params: Promise<{ params: string[] }> },
) {
	try {
		const { accessToken } = await getValidatedTokenFromSession();
		const resolvedParams = await params;
		const pathParams = resolvedParams.params || [];

		const { serviceUrl, headers, body } = await buildServiceRequest(
			request,
			pathParams,
			accessToken,
		);

		const response = await fetch(serviceUrl, {
			method: request.method,
			headers,
			body,
		});

		if (response.status === 401) {
			const newTokens = await forceRefreshToken();

			const retryResponse = await fetch(serviceUrl, {
				method: request.method,
				headers: {
					...headers,
					Authorization: `Bearer ${newTokens.accessToken}`,
				},
				body,
			});

			if (retryResponse.status === 401) {
				return NextResponse.redirect(new URL('/login', request.url));
			}

			return new Response(await retryResponse.text(), {
				status: retryResponse.status,
				headers: retryResponse.headers,
			});
		}

		if (response.status === 204 || response.status === 205 || response.status === 304) {
			return new Response(null, {
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
			});
		}

		const responseData = await response.text();

		const nextResponse = new Response(responseData, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});

		return nextResponse;
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.shouldRedirect) {
				return NextResponse.redirect(new URL('/login', request.url));
			}

			return new Response(JSON.stringify({ error: error.message }), {
				status: error.statusCode,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

// Экспортируем обработчики для всех методов
export { handler as DELETE, handler as GET, handler as PATCH, handler as POST, handler as PUT };
