'use server';

import { IronSession, SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface ISessionData {
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: number;
	isLoggedIn: boolean;
	userId?: number;
	role?: string;
	needsRefresh?: boolean;
	lastChecked?: number;
	refreshCount?: number;
}

const defaultSession: ISessionData = {
	isLoggedIn: false,
	refreshCount: 0,
};

const sessionOptions: SessionOptions = {
	password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
	cookieName: 'servemate_session',
	cookieOptions: {
		secure: false, // Set to true in production
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 7, // 7 days
		domain: process.env.NODE_ENV === 'development' ? undefined : 'your-domain.com',
		// domain: process.env.SESSION_COOKIE_DOMAIN, // Uncomment if you need to set a specific domain
	},
	ttl: 60 * 60 * 24 * 7, // 7 days
};

export async function getSession(): Promise<IronSession<ISessionData>> {
	const session = await getIronSession<ISessionData>(await cookies(), sessionOptions);

	if (!session.isLoggedIn) {
		if (!session.isLoggedIn) {
			Object.assign(session, defaultSession);
		}
	}

	return session;
}

export async function updateSession(data: Partial<ISessionData>): Promise<void> {
	const session = await getSession();

	Object.assign(session, data);

	await session.save();
}

export async function destroySession(): Promise<void> {
	const session = await getSession();
	session.destroy();
}
export async function getSessionOptions(): Promise<SessionOptions> {
	return {
		...sessionOptions,
	};
}
