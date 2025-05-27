'use server';

import { IronSession, SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface ISessionData {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
	isLoggedIn: boolean;
	userId: number;
	role?: string;
	needsRefresh?: boolean; // Флаг для обозначения необходимости обновления токена
	lastChecked?: number; // Время последней проверки токена
}

const sessionOptions: SessionOptions = {
	password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
	cookieName: 'servemate_session',
	cookieOptions: {
		secure: process.env.PRODUCTION === 'PRODUCTION', // Set to true in production
		httpOnly: true,
		sameSite: 'lax',
	},
	ttl: 60 * 60 * 24 * 7, // 7 days
};

export async function getSession(): Promise<IronSession<ISessionData>> {
	const session = await getIronSession<ISessionData>(await cookies(), sessionOptions);

	if (!session.isLoggedIn) {
		session.isLoggedIn = false;
	}

	return session;
}

export async function getSessionOptions(): Promise<SessionOptions> {
	return {
		...sessionOptions,
	};
}
