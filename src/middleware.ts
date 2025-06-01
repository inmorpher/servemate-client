import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/session';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Публичные страницы, которые не требуют аутентификации
	const publicPaths = ['/login', '/register'];

	// Если это публичная страница, пропускаем проверку аутентификации
	if (publicPaths.includes(pathname)) {
		const session = await getSession();
		// Если пользователь уже авторизован и пытается зайти на login, перенаправляем на dashboard
		if (session && session.refreshToken && pathname === '/login') {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}
		return NextResponse.next();
	}

	// Для всех остальных страниц проверяем аутентификацию
	const session = await getSession();

	if (!session || !session.refreshToken) {
		console.log('no session or refreshToken');
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
