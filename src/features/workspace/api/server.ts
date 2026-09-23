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

	return response.json() as Promise<WorkspaceBootstrap>;
};
