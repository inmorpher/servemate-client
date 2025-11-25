import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/session';

const protectedRoutes = ['/orders', '/dashboard', '/products', '/users'];

export default async function Proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

	if (!isProtectedRoute) {
		return NextResponse.next();
	}

	const session = await getSession();

	if (!session || !session.isLoggedIn) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/(protected)/:path*', '/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
