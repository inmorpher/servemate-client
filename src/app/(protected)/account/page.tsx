'use server';

export default async function AccountPage() {
	// const formatDate = (dateString: Date | null | undefined): string => {
	// 	if (!dateString) {
	// 		return 'Не указано';
	// 	}

	// 	try {
	// 		const date = new Date(dateString);
	// 		return new Intl.DateTimeFormat('ru-RU', {
	// 			day: '2-digit',
	// 			month: '2-digit',
	// 			year: 'numeric',
	// 			hour: '2-digit',
	// 			minute: '2-digit',
	// 		}).format(date);
	// 	} catch (error) {
	// 		console.error('Ошибка форматирования даты:', error);
	// 		return 'Некорректная дата';
	// 	}
	// };

	// if (!user) {
	// 	return (
	// 		<div className='flex items-center justify-center h-screen'>
	// 			<div className='text-ctp-red'>Ошибка загрузки данных пользователя</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className='bg-ctp-mantle rounded-lg p-6 shadow-lg'>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-ctp-mauve text-2xl font-bold'>Профиль пользователя</h1>
			</div>

			<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
				<div className='bg-ctp-surface0 space-y-4 rounded-lg p-4'>
					<h2 className='text-ctp-lavender mb-2 text-xl font-semibold'>
						Основная информация
					</h2>
					<div className='text-ctp-subtext1'>
						<div className='mb-3'>
							<span className='text-ctp-subtext0 block text-sm font-medium'>Имя</span>
							{/* <span className='block text-lg text-ctp-peach'>{user?.name || 'Не указано'}</span> */}
						</div>
						<div className='mb-3'>
							<span className='text-ctp-subtext0 block text-sm font-medium'>
								Email
							</span>

							{/* <SkeletonText isLoading={isUserLoading}> */}
							{/* <span className='block text-lg text-ctp-blue'>{user?.email || 'Не указано'}</span> */}
							{/* </SkeletonText> */}
						</div>
						<div className='mb-3'>
							<span className='text-ctp-subtext0 block text-sm font-medium'>
								Роль
							</span>
							<span className='block text-lg'>
								{/* {isUserLoading ? (
									<div className='h-6 w-24 bg-ctp-surface2 rounded animate-pulse'></div>
								) : (
									<span className='text-ctp-green'>{user?.role || 'Не указана'}</span>
								)} */}
							</span>
						</div>
						<div>
							<span className='text-ctp-subtext0 mb-1 block text-sm font-medium'>
								Статус
							</span>
							{/* <span
								className={`inline-block px-2 py-1 text-xs font-medium rounded ${
									user?.isActive ? 'bg-ctp-green text-ctp-base' : 'bg-ctp-red text-ctp-base'
								}`}
							>
								{user?.isActive ? 'Активен' : 'Неактивен'}
							</span> */}
						</div>
					</div>
				</div>
				<div className='bg-ctp-surface0 space-y-4 rounded-lg p-4'>
					<h2 className='text-ctp-lavender mb-2 text-xl font-semibold'>
						Детальная информация
					</h2>
					<div className='text-ctp-subtext1'>
						<div className='mb-3'>
							<span className='text-ctp-subtext0 block text-sm font-medium'>
								ID пользователя
							</span>
							{/* <span className='block text-lg text-ctp-teal'>{user.id}</span> */}
						</div>
						<div className='mb-3'>
							<span className='text-ctp-subtext0 block text-sm font-medium'>
								Последний вход
							</span>
							{/* <span className='block text-lg text-ctp-sky'>{formatDate(user?.lastLogin)}</span> */}
						</div>
						<div className='mb-3'>
							<span className='text-ctp-subtext0 block text-sm font-medium'>
								Дата создания
							</span>
							{/* <span className='block text-lg text-ctp-sapphire'>{formatDate(user?.createdAt)}</span> */}
						</div>
						<div>
							<span className='text-ctp-subtext0 block text-sm font-medium'>
								Дата обновления
							</span>
							{/* <span className='block text-lg text-ctp-sapphire'>{formatDate(user?.updatedAt)}</span> */}
						</div>
					</div>
				</div>
			</div>

			{/* <button
				onClick={(event) => {
					event.preventDefault();
					toast({
						message: 'Success',
						type: 'success',
					});
				}}
				className='mt-6 bg-ctp-green text-white px-4 py-2 rounded-lg hover:bg-ctp-green-dark transition duration-200'
			>
				Success button
			</button>

			<button
				onClick={(event) => {
					event.preventDefault();
					toast({
						message: 'Warning',
						type: 'warn',
					});
				}}
				className='mt-6 bg-ctp-green text-white px-4 py-2 rounded-lg hover:bg-ctp-green-dark transition duration-200'
			>
				war button
			</button> */}

			{/* <button
				onClick={(event) => {
					event.preventDefault();
					toast({
						message: 'Error',
						type: 'error',
					});
				}}
				className='mt-6 bg-ctp-green text-white px-4 py-2 rounded-lg hover:bg-ctp-green-dark transition duration-200'
			>
				error button
			</button>

			<button
				onClick={(event) => {
					event.preventDefault();
					toast({
						message: 'Info',
						type: 'info',
					});
				}}
				className='mt-6 bg-ctp-green text-white px-4 py-2 rounded-lg hover:bg-ctp-green-dark transition duration-200'
			>
				info button
			</button> */}
		</div>
	);
}
