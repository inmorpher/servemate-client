'use client';

import { api } from '@/shared/api/instance';
import { useRouter } from 'next/navigation';
import { useLogout } from '../../features/auth/hooks/useLogout';

export default function Dashboard() {
	const { logout } = useLogout();

	const router = useRouter();

	const handleUsers = async () => {
		const response = await api.get('/users');
		console.log('Users:', response.data);
	};

	const navigateToAccount = () => {
		router.push('/account');
	};

	return (
		<div className='min-h-screen bg-ctp-base text-ctp-text p-8'>
			<button onClick={handleUsers}>users</button>
			<div className='max-w-4xl mx-auto'>
				<div className='bg-ctp-mantle rounded-lg shadow-lg p-6 mb-8'>
					<div className='flex justify-between items-center mb-4'>
						<h1 className='text-3xl font-bold text-ctp-mauve'>Панель управления</h1>
						<div className='flex space-x-2'>
							<button
								onClick={navigateToAccount}
								className='bg-ctp-blue hover:bg-ctp-sapphire text-white px-4 py-2 rounded transition duration-200'
							>
								Мой аккаунт
							</button>
							<button
								onClick={logout}
								className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200'
							>
								Выйти
							</button>
						</div>
					</div>
					<p className='text-ctp-subtext0 mb-4'>
						Добро пожаловать в систему управления ServateMate!
					</p>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
						<div className='bg-ctp-surface0 p-4 rounded-lg'>
							<h2 className='text-xl font-semibold text-ctp-lavender mb-2'>Ваш профиль</h2>
							{/* <div className='text-ctp-subtext1'>
								<p>
									Имя пользователя:{' '}
									<span className='text-ctp-peach'>{userData.name || 'Не указано'}</span>
								</p>
								<p>
									Email: <span className='text-ctp-blue'>{userData.email}</span>
								</p>
							</div> */}
						</div>

						<div className='bg-ctp-surface0 p-4 rounded-lg'>
							<h2 className='text-xl font-semibold text-ctp-lavender mb-2'>Статистика</h2>
							<div className='text-ctp-subtext1'>
								<p>
									Последний вход: <span className='text-ctp-sky'>{}</span>
								</p>
								<p>
									Статус:{' '}
									<span className='bg-ctp-green text-ctp-base px-2 py-0.5 rounded-full text-sm'>
										Активен
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
