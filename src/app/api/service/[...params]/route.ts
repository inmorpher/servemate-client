'use server';

import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './errors';
import { buildServiceRequest } from './request-utils';
import { getValidatedTokenFromSession } from './token-utils';

async function handler(
	request: NextRequest,
	{ params }: { params: Promise<{ params: string[] }> }
) {
	try {
		const { accessToken } = await getValidatedTokenFromSession();
		const resolvedParams = await params;
		const pathParams = resolvedParams.params || [];

		const { serviceUrl, headers, body } = await buildServiceRequest(
			request,
			pathParams,
			accessToken
		);

		const response = await fetch(serviceUrl, {
			method: request.method,
			headers,
			body,
		});

		const responseData = await response.text();

		const nextResponse = new Response(responseData, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});
		nextResponse.headers.set(
			'Set-Cookie',
			'test_from_api=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400'
		);
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
