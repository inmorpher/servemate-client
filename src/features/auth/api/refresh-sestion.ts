'use server';

import { CONFIG } from '@/app/api/service/[...params]/config';
import { getSession } from '@/app/lib/session';
import { updateSessionWithTokens } from '@/app/lib/session-update';

export async function refreshSessionAction() {
	try {
		const session = await getSession();
		console.log('🔄 Refreshing session, current refreshCount:', session.refreshCount);
		if (!session?.refreshToken) {
			return { success: false, error: 'No refresh token' };
		}

		const response = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh-token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken: session.refreshToken }),
		});

		if (!response.ok) {
			return { success: false, error: 'Token refresh failed' };
		}

		const data = await response.json();
		const currentCount = session.refreshCount || 0;

		// ✅ Используем централизованную функцию вместо дублирования логики
		await updateSessionWithTokens(data, {
			refreshCount: currentCount + 1,
		});

		return { success: true };
	} catch (error: unknown) {
		return { success: false, error: `An error occurred while refreshing session. ${error}` };
	}
}
