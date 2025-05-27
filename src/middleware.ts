import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/session';
import { refreshTokenAction } from './shared/api/refreshToken';

export async function middleware(request: NextRequest) {
	console.log('🔥 Middleware сработал для:', request.nextUrl.pathname);
	console.log('🔥 URL:', request.url);

	const response = NextResponse.next();

	try {
		const session = await getSession();

		if (!session.isLoggedIn || !session.accessToken) {
			return NextResponse.redirect(new URL('/login', request.url));
		}

		const now = Date.now();

		const tokenExpiredIn = session.expiresAt * 1000;
		const fiveMinutes = 0; // 5 minutes in milliseconds

		let shouldRefresh = false;

		if (session.expiresAt && now > session.expiresAt - fiveMinutes) {
			console.log('Token is about to expire, refreshing...');
			shouldRefresh = true;
		}

		if (session.needsRefresh) {
			console.log('Session needs refresh, refreshing token...');
			shouldRefresh = true;
		}

		console.log('token exporisd in:', tokenExpiredIn);
		console.log('now is :', now);
		console.log('shouldRefresh:', now - tokenExpiredIn);

		if (shouldRefresh && session.refreshToken) {
			console.log('Token needs refresh, redirecting to refresh endpoint');
			try {
				const { accessToken, refreshToken } = await refreshTokenAction(session.refreshToken);

				session.accessToken = accessToken;
				session.refreshToken = refreshToken;
				session.expiresAt = Date.now() + 60 * 60 * 1000; // Set new expiration time (1 hour from now)
				session.needsRefresh = false;
				session.lastChecked = Date.now(); // Update last checked time
				await session.save();
				console.log('Token successfully refreshed');
			} catch (error) {
				console.error('Error refreshing token:', error);
				// If refresh fails, redirect to login
				return NextResponse.redirect(new URL('/login', request.url));
			}
		}
		return response;
	} catch (error) {
		console.error('Error in middleware:', error);
	}
}

export const config = {
	matcher: ['/users/:path*'],
};
