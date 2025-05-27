'use client';

import { getUsers } from '@/shared/api/users/users.api';
import { UserListResult } from '@servemate/dto';
import { useState } from 'react';

export function TestList({ initialUsers }: { initialUsers: UserListResult }) {
	const [data, setData] = useState<UserListResult | null>(initialUsers);

	const fecthDataHandler = async (event) => {
		event.preventDefault();
		// const response = await fetch('/api/users?page=2');

		// if (!response.ok) {
		// 	throw new Error('Failed to fetch data');
		// }
		const randomNumber = Math.floor(Math.random() * 20);

		const response = await getUsers({ page: 4 });

		setData(response);
	};

	return (
		<div>
			<button onClick={(event) => fecthDataHandler(event)}>Fetch Data</button>
			<h1>Test List</h1>
			{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
		</div>
	);
}
