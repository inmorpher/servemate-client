'use server';

import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './errors';
import { buildServiceRequest } from './request-utils';
import { getValidatedTokenFromSession } from './token-utils';

async function handler(request: NextRequest, { params }: { params: { params: string[] } }) {
	try {
		const { accessToken } = await getValidatedTokenFromSession();
		const resolvedParams = await params;
		const pathParams = resolvedParams.params || [];

		const { serviceUrl, headers, body } = await buildServiceRequest(
			request,
			pathParams,
			accessToken
		);

		console.log(`🌐 [API] ${request.method} ${serviceUrl}`);

		const response = await fetch(serviceUrl, {
			method: request.method,
			headers,
			body,
		});

		const responseData = await response.text();

		return new Response(responseData, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		});
	} catch (error) {
		console.error('❌ [API] Ошибка обработки запроса:', error);

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
