import { IronSession } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';
import { getSession, ISessionData } from './app/lib/session';

const protectedRoutes = ['/orders', '/dashboard', '/products', '/users'];

export default async function Proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
	console.log('Proxy middleware triggered for:', pathname);

	if (pathname === '/login') {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	if (pathname === '/') {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	const session = await getSession();

	if (!session || !session.isLoggedIn) {
		return NextResponse.redirect(new URL('/login', request.url));
	}
	// if (
	// 	isAccessTokenExpired(session) &&
	// 	pathname !== '/' &&
	// 	pathname !== '/login' &&
	// 	pathname !== '/refresh'
	// ) {о
	// 	const refreshUrl = new URL('/refresh', request.url);
	// 	refreshUrl.searchParams.set('returnUrl', pathname + request.nextUrl.search);
	// 	return NextResponse.redirect(refreshUrl);
	// }
	return NextResponse.next();
}

function isAccessTokenExpired(session: IronSession<ISessionData>): boolean {
	if (session.expiresAt === undefined) return true;
	return Date.now() >= session.expiresAt;
}

export const config = {
	matcher: [
		'/(protected)/:path*',
		'/((?!_next/static|_next/image|favicon.ico|api|refresh|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|font|ttf|woff|woff2)).*)',
	],
};
