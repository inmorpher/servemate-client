import { NextRequest, NextResponse } from 'next/server';

const middleware = (req: NextRequest) => {
	const authCookie = req.cookies.get('refreshToken');

	if (req.nextUrl.pathname === '/') {
		if (!authCookie) {
			return NextResponse.redirect(new URL('/login', req.url));
		}

		return NextResponse.redirect(new URL('/dashboard', req.url));
	}

	if (!authCookie) {
		if (req.nextUrl.pathname === '/login') {
			return NextResponse.next();
		}

		return NextResponse.redirect(new URL('/login', req.url));
	}

	return NextResponse.next();
};

export default middleware;

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
