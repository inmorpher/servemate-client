// import { apiClient } from '@/shared/api/apiClient';
// 'use client';
// export default async function Dashboard() {

// 	return (
// 		// <div className='bg-ctp-mantle rounded-lg shadow-lg p-6 mb-8'>
// 		// 	<div className='flex justify-between items-center mb-4'>
// 		// 		<h1 className='text-3xl font-bold text-ctp-mauve'>Панель управления</h1>
// 		// 	</div>
// 		// 	<p className='text-ctp-subtext0 mb-4'>Добро пожаловать в систему управления ServateMate!</p>

// 		// 	<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
// 		// 		<div className='bg-ctp-surface0 p-4 rounded-lg'>
// 		// 			<h2 className='text-xl font-semibold text-ctp-lavender mb-2'>Ваш профиль</h2>
// 		// 			{/* <div className='text-ctp-subtext1'>
// 		// 					<p>
// 		// 						Имя пользователя:{' '}
// 		// 						<span className='text-ctp-peach'>{userData.name || 'Не указано'}</span>
// 		// 					</p>
// 		// 					<p>
// 		// 						Email: <span className='text-ctp-blue'>{userData.email}</span>
// 		// 					</p>
// 		// 				</div> */}
// 		// 		</div>

// 		// 		<div className='bg-ctp-surface0 p-4 rounded-lg'>
// 		// 			<h2 className='text-xl font-semibold text-ctp-lavender mb-2'>Статистика</h2>
// 		// 			<div className='text-ctp-subtext1'>
// 		// 				<p>
// 		// 					Последний вход: <span className='text-ctp-sky'>{}</span>
// 		// 				</p>
// 		// 				<p>
// 		// 					Статус:{' '}
// 		// 					<span className='bg-ctp-green text-ctp-base px-2 py-0.5 rounded-full text-sm'>
// 		// 						Активен
// 		// 					</span>
// 		// 				</p>
// 		// 			</div>
// 		// 		</div>
// 		// 	</div>
// 		// </div>
// 	);
// }

// // className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-transform duration-300 h-6 w-10 ${
// // 	type === 'success'
// // 		? 'bg-green-500 text-white'
// // 		: type === 'error'
// // 			? 'bg-red-500 text-white'
// // 			: 'bg-blue-500 text-white'
// // }`}

'use client';

import { refreshTokenAction } from '@/shared/api/refreshToken';
import { getUserData } from '@/shared/api/testGetData';
import { useState } from 'react';

export default function RefreshTokenButton() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleClick = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await refreshTokenAction();

			if (result.error) {
				setError(result.error);
			} else {
				// Успешно обновили токен
				alert('Token refreshed successfully!');
			}
		} catch (error: any) {
			setError(error.message || 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	const handleClick2 = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await getUserData();

			if (result.error) {
				setError(result.error);
			} else {
				// Успешно обновили токен
				console.log('User data:', result);
			}
		} catch (error: any) {
			setError(error.message || 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<button
				onClick={handleClick}
				disabled={isLoading}
				className='bg-blue-500 text-white px-4 py-2 rounded'
			>
				{isLoading ? 'Refreshing...' : 'Refresh Token'}
			</button>

			<button
				onClick={handleClick2}
				disabled={isLoading}
				className='bg-blue-500 text-white px-4 py-2 rounded'
			>
				{isLoading ? 'Refreshing...' : 'get user data'}
			</button>
			{error && <div style={{ color: 'red' }}>{error}</div>}
		</div>
	);
}
