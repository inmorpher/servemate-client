import { getSession } from '@/app/lib/session';

const session = await getSession();

if (!session?.accessToken) {
	throw new Error('No access token found');
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
	try {
		const response = fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${session.accessToken}`,
			},
		});

		return (await response).json();
	} catch (error) {
		throw new Error('Error fetching data with auth', error as any);
	}
};
