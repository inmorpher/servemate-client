import { UserListResult, UserSearchCriteria } from '@servemate/dto';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { UsersPageContainer } from './testList';

export const metadata: Metadata = {
	title: 'Users',
	description: 'User management page',
};

interface UsersPageProps {
	searchParams: Promise<UserSearchCriteria>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
	const resolvedSearchParams = await searchParams;
	console.log('UsersPage searchParams:', resolvedSearchParams);

	const cookieStore = await cookies();
	const freshToken = cookieStore.get('fresh-access-token');

	if (!freshToken) {
		console.error('No fresh access token found in cookies');
		return <div className='text-red-500'>Unauthorized: No access token</div>;
	}

	try {
		// Создаем URLSearchParams для построения query string
		const queryParams = new URLSearchParams();

		// Фильтруем и добавляем только непустые параметры
		Object.entries(resolvedSearchParams).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				queryParams.append(key, String(value));
			}
		});

		const apiUrl = `http://192.168.2.60:3002/api/users?${queryParams.toString()}`;
		console.log('Fetching from URL:', apiUrl);

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${freshToken.value}`,
			},
			cache: 'no-store',
			next: { revalidate: 0 },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
		}

		const usersData: UserListResult = await response.json();
		console.log('Users data received:', usersData);

		// return  />;
		return <UsersPageContainer initialData={usersData} searchParams={resolvedSearchParams} />;
	} catch (error) {
		console.error('Error fetching users:', error);
		return (
			<div className='text-red-500 p-4'>
				<h2>Error loading users</h2>
				<p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
			</div>
		);
	}
}
