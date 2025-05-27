import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from './app/lib/session';

export async function middleware(request: NextRequest) {
	console.log('Middleware triggered for:', request.nextUrl.pathname);

	const session = await getSession();

	const isLoggedIn = session?.isLoggedIn;

	if (!isLoggedIn) {
		console.log('User is not logged in, redirecting to login page');
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// Check if token is expired
	// const isTokenExpired = session?.expiresAt ? Date.now() > session.expiresAt : true;

	const isTokenExpired = true;

	console.log('Token expiration check middleware:', {
		expiresAt: session?.expiresAt,
		currentTime: Date.now(),
		isTokenExpired,
	});

	if (isTokenExpired) {
		console.log('Token is expired, redirecting to login page');
		session.needsRefresh = true;
		await session.save();
		// return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/((?!api/|_next/static|_next/image|favicon.ico|login|register).*)',
		'/dashboard/:path*',
		'/account/:path*',
		'/users/:path*',
		'/search/:path*',
	],
};
