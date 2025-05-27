'use client';

import { getUsers } from '@/shared/api/users/users.api';
import { UserListResult } from '@servemate/dto';
import { useEffect, useState } from 'react';

export function TestList() {
	const [data, setData] = useState<UserListResult | null>(null);

	const fecthDataHandler = async (event) => {
		event.preventDefault();
		console.log('Fetching data...');
		// const response = await fetch('/api/users?page=2');

		// if (!response.ok) {
		// 	throw new Error('Failed to fetch data');
		// }
		const randomNumber = Math.floor(Math.random() * 20);

		const response = await getUsers({ page: 4 });

		setData(response);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getUsers({ page: 1 });
				setData(response);
			} catch (error) {
				console.error('Ошибка при загрузке данных:', error);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<button onClick={(event) => fecthDataHandler(event)}>Fetch Data</button>
			<h1>Test List</h1>
			{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
		</div>
	);
}
