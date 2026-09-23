import { CONFIG } from '@/app/api/service/[...params]/config';
import { getSession } from '@/app/lib/session';
import type { WorkspaceBootstrap } from '../types';

export const getWorkspaceBootstrapOnServer = async (): Promise<WorkspaceBootstrap> => {
	const session = await getSession();

	if (!session.accessToken) {
		throw new Error('No access token in session');
	}

	const response = await fetch(`${CONFIG.API_BASE_URL}/workspace/bootstrap`, {
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error('Failed to fetch workspace bootstrap');
	}

	const bootstrap = (await response.json()) as WorkspaceBootstrap;
	if (bootstrap.activeTab?.type !== 'users') {
		return bootstrap;
	}

	try {
		const metaResponse = await fetch(`${CONFIG.API_BASE_URL}/users/meta`, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
			cache: 'no-store',
		});

		if (!metaResponse.ok) {
			return bootstrap;
		}

		return {
			...bootstrap,
			activeTabMeta: await metaResponse.json(),
		};
	} catch {
		return bootstrap;
	}
};
