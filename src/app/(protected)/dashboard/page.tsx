import { API_BASE_URL } from '@/consts';

export default async function Dashboard() {
	console.log(`${API_BASE_URL}`);

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
