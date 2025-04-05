'use client';

import { useGetMe } from '@/features/users/hooks/useGetMe';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useLogout } from '../(auth)/hooks/useLogout';

export default function AccountPage() {
	const { user, isLoading: isUserLoading, error } = useGetMe();
	const { logout } = useLogout();
	const { isLoading: isAuthLoading } = useAuth();
	const router = useRouter();

	// useEffect(() => {
	// 	// Проверяем авторизацию только после окончания загрузки данных об авторизации
	// 	if (!isAuthLoading && !isAuth) {
	// 		router.push('/login');
	// 	}
	// }, [isAuth, isAuthLoading, router]);

	const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		try {
			await logout();
		} catch (error) {
			console.error('Ошибка выхода:', error);
		}
	};

	const navigateToDashboard = () => {
		router.push('/dashboard');
	};

	// Показываем индикатор загрузки, пока проверяется авторизация или загружается профиль
	if (isAuthLoading || isUserLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-ctp-base'>
				<div className='text-ctp-text animate-pulse'>Загрузка данных...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-ctp-base text-ctp-text p-8'>
				<div className='max-w-4xl mx-auto'>
					<div className='bg-ctp-red bg-opacity-20 border border-ctp-red text-ctp-red px-4 py-3 rounded'>
						<p>{error}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className='min-h-screen bg-ctp-base text-ctp-text p-8'>
				<div className='max-w-4xl mx-auto'>
					<div className='bg-ctp-yellow bg-opacity-20 border border-ctp-yellow text-ctp-yellow px-4 py-3 rounded'>
						<p>Информация о пользователе недоступна</p>
					</div>
				</div>
			</div>
		);
	}

	const formatDate = (dateString: Date | null | undefined): string => {
		if (!dateString) {
			return 'Не указано';
		}

		try {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(date);
		} catch (error) {
			console.error('Ошибка форматирования даты:', error);
			return 'Некорректная дата';
		}
	};

	return (
		<div className='min-h-screen bg-ctp-base text-ctp-text p-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='bg-ctp-mantle rounded-lg shadow-lg p-6'>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-2xl font-bold text-ctp-mauve'>Профиль пользователя</h1>
						<div className='flex space-x-2'>
							<button
								onClick={navigateToDashboard}
								className='bg-ctp-blue hover:bg-ctp-sapphire text-white px-4 py-2 rounded transition duration-200'
							>
								Панель управления
							</button>
							<button
								onClick={handleLogout}
								className='bg-ctp-red hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200'
							>
								Выйти
							</button>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='bg-ctp-surface0 p-4 rounded-lg space-y-4'>
							<h2 className='text-xl font-semibold text-ctp-lavender mb-2'>Основная информация</h2>
							<div className='text-ctp-subtext1'>
								<div className='mb-3'>
									<span className='block text-sm font-medium text-ctp-subtext0'>Имя</span>
									<span className='block text-lg text-ctp-peach'>{user.name || 'Не указано'}</span>
								</div>
								<div className='mb-3'>
									<span className='block text-sm font-medium text-ctp-subtext0'>Email</span>
									<span className='block text-lg text-ctp-blue'>{user.email || 'Не указано'}</span>
								</div>
								<div className='mb-3'>
									<span className='block text-sm font-medium text-ctp-subtext0'>Роль</span>
									<span className='block text-lg text-ctp-green'>{user.role || 'Не указана'}</span>
								</div>
								<div>
									<span className='block text-sm font-medium text-ctp-subtext0 mb-1'>Статус</span>
									<span
										className={`inline-block px-2 py-1 text-xs font-medium rounded ${
											user.isActive ? 'bg-ctp-green text-ctp-base' : 'bg-ctp-red text-ctp-base'
										}`}
									>
										{user.isActive ? 'Активен' : 'Неактивен'}
									</span>
								</div>
							</div>
						</div>
						<div className='bg-ctp-surface0 p-4 rounded-lg space-y-4'>
							<h2 className='text-xl font-semibold text-ctp-lavender mb-2'>Детальная информация</h2>
							<div className='text-ctp-subtext1'>
								<div className='mb-3'>
									<span className='block text-sm font-medium text-ctp-subtext0'>
										ID пользователя
									</span>
									<span className='block text-lg text-ctp-teal'>{user.id}</span>
								</div>
								<div className='mb-3'>
									<span className='block text-sm font-medium text-ctp-subtext0'>
										Последний вход
									</span>
									<span className='block text-lg text-ctp-sky'>{formatDate(user.lastLogin)}</span>
								</div>
								<div className='mb-3'>
									<span className='block text-sm font-medium text-ctp-subtext0'>Дата создания</span>
									<span className='block text-lg text-ctp-sapphire'>
										{formatDate(user.createdAt)}
									</span>
								</div>
								<div>
									<span className='block text-sm font-medium text-ctp-subtext0'>
										Дата обновления
									</span>
									<span className='block text-lg text-ctp-sapphire'>
										{formatDate(user.updatedAt)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
