import { NextRequest, NextResponse } from 'next/server';
import { getValidatedTokenFromSession } from './app/api/service/[...params]/token-utils';
import { getSession } from './app/lib/session';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const method = request.method;
	console.log(`   🌐 URL: ${request.url}`);
	console.log(`   🔧 Method: ${method}`);
	console.log(`   📍 Path: ${pathname}`);
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

	const { accessToken, refreshToken } = await getValidatedTokenFromSession();

	if (!accessToken || !refreshToken) {
		console.log('no accessToken or refreshToken');
		return NextResponse.redirect(new URL('/login', request.url));
	}

	session.accessToken = accessToken;
	session.refreshToken = refreshToken;
	await session.save();

	const freshSession = await getSession();
	const response = NextResponse.next();
	console.log('Fresh session after save:', freshSession?.accessToken);
	response.cookies.set('fresh-access-token', accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
		maxAge: 30 * 60, // 30 минут
	});
	console.log('Set fresh-access-token cookie:', accessToken);
	return response;
}

export const config = {
	matcher: [
		// Исключаем статические файлы и системные пути
		'/((?!_next/static|_next/image|favicon.ico|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|api/auth).*)',
	],
};
