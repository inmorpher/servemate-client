'use client';

import { useToaster } from '@/shared/components/toaster/ToasterProvider';
import { UserListResult, UserSearchCriteria } from '@servemate/dto';
import { useQuery } from '@tanstack/react-query';
const test: UserListResult;
const sort: UserSearchCriteria;
export function TestList() {
	const { toast } = useToaster();

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['userList'],
		queryFn: async () => {
			const response = await fetch('/api/service/users');
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			toast({
				message: 'Data fetched successfully',
				type: 'success',
				duration: 'SHORT',
			});
			return response.json();
		},
	});

	return (
		<div>
			<button onClick={(event) => refetch()}>Fetch Data</button>
			<h1>Test List</h1>
			{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
		</div>
	);
}
