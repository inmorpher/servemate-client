import { cookies } from 'next/headers';

export default async function Dashboard() {
	const cookieStore = await cookies();

	// Читаем ТОЛЬКО свежий токен из middleware
	const freshToken = cookieStore.get('fresh-access-token');

	const response = await fetch('http://192.168.2.60:3002/api/users', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${freshToken?.value || ''}`,
		},
	});

	console.log('Response from API:', await response.json());

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
			<p className='text-lg'>Welcome to the dashboard!</p>
			<button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
				Load Dashboard Data
			</button>
		</div>
	);
}
