export default async function Dashboard() {
	return (
		<div className='flex h-screen flex-col items-center justify-center'>
			<h1 className='mb-4 text-2xl font-bold'>Dashboard</h1>
			<p className='text-lg'>Welcome to the dashboard!</p>
			<button className='mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
				Load Dashboard Data
			</button>
		</div>
	);
}
