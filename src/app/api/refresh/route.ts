import { getSession } from '@/app/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	console.log('🔥 Refresh endpoint triggered');

	let body = null;
	let refreshTokenFromBody = null;

	try {
		// Безопасно читаем body
		const text = await request.text();
		console.log('📋 Raw body text:', text);

		if (text && text.trim()) {
			body = JSON.parse(text);
			refreshTokenFromBody = body?.refreshToken;
			console.log('📋 Parsed body:', body);
		} else {
			console.log('📋 Body пустое, будем использовать токен из сессии');
		}
	} catch (bodyError) {
		console.log('⚠️ Ошибка чтения body:', bodyError);
		console.log('📋 Будем использовать токен из сессии');
	}

	try {
		const session = await getSession();

		if (!session) {
			console.error('❌ Сессия не найдена');
			return NextResponse.json({ error: 'Сессия не найдена' }, { status: 401 });
		}

		// Используем токен из body или из сессии
		const refreshToken = refreshTokenFromBody || session.refreshToken;

		if (!refreshToken) {
			console.error('❌ Refresh токен отсутствует');
			console.log('📋 Токен из body:', refreshTokenFromBody);
			console.log('📋 Токен из сессии:', session.refreshToken);
			console.log('📋 Полное содержимое сессии:', JSON.stringify(session, null, 2));
			return NextResponse.json({ error: 'Нет refresh токена' }, { status: 401 });
		}

		console.log('🌐 Используем refresh токен:', refreshToken.substring(0, 20) + '...');
		console.log('🌐 Источник токена:', refreshTokenFromBody ? 'body' : 'session');

		const tokens = await fetch('http://localhost:3002/api/auth/refresh-token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refreshToken }),
			cache: 'no-store',
		});

		console.log('✅ Ответ от внешнего API, статус:', tokens.status);

		if (!tokens.ok) {
			const error = await tokens.json();
			console.error('❌ Ошибка при получении новых токенов:', error);
			return NextResponse.json({ error: 'Не удалось обновить токен' }, { status: 500 });
		}

		const { accessToken, refreshToken: newRefreshToken } = await tokens.json();

		// Обновляем сессию
		console.log('💾 Обновляем сессию с новыми токенами...');
		session.accessToken = accessToken;
		session.refreshToken = newRefreshToken;
		session.expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 час в секундах
		session.needsRefresh = false;

		await session.save();
		console.log('✅ Сессия обновлена и сохранена');

		return NextResponse.json({ accessToken, refreshToken: newRefreshToken });
	} catch (error) {
		console.error('❌ Ошибка обновления токена:', error);
		console.error('❌ Стек ошибки:', error instanceof Error ? error.stack : 'Нет стека');
		return NextResponse.json(
			{
				error: 'Не удалось обновить токен',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
