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
		<div className='bg-ctp-mantle rounded-lg shadow-lg p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold text-ctp-mauve'>Профиль пользователя</h1>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='bg-ctp-surface0 p-4 rounded-lg space-y-4'>
					<h2 className='text-xl font-semibold text-ctp-lavender mb-2'>Основная информация</h2>
					<div className='text-ctp-subtext1'>
						<div className='mb-3'>
							<span className='block text-sm font-medium text-ctp-subtext0'>Имя</span>
							{/* <span className='block text-lg text-ctp-peach'>{user?.name || 'Не указано'}</span> */}
						</div>
						<div className='mb-3'>
							<span className='block text-sm font-medium text-ctp-subtext0'>Email</span>

							{/* <SkeletonText isLoading={isUserLoading}> */}
							{/* <span className='block text-lg text-ctp-blue'>{user?.email || 'Не указано'}</span> */}
							{/* </SkeletonText> */}
						</div>
						<div className='mb-3'>
							<span className='block text-sm font-medium text-ctp-subtext0'>Роль</span>
							<span className='block text-lg'>
								{/* {isUserLoading ? (
									<div className='h-6 w-24 bg-ctp-surface2 rounded animate-pulse'></div>
								) : (
									<span className='text-ctp-green'>{user?.role || 'Не указана'}</span>
								)} */}
							</span>
						</div>
						<div>
							<span className='block text-sm font-medium text-ctp-subtext0 mb-1'>Статус</span>
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
				<div className='bg-ctp-surface0 p-4 rounded-lg space-y-4'>
					<h2 className='text-xl font-semibold text-ctp-lavender mb-2'>Детальная информация</h2>
					<div className='text-ctp-subtext1'>
						<div className='mb-3'>
							<span className='block text-sm font-medium text-ctp-subtext0'>ID пользователя</span>
							{/* <span className='block text-lg text-ctp-teal'>{user.id}</span> */}
						</div>
						<div className='mb-3'>
							<span className='block text-sm font-medium text-ctp-subtext0'>Последний вход</span>
							{/* <span className='block text-lg text-ctp-sky'>{formatDate(user?.lastLogin)}</span> */}
						</div>
						<div className='mb-3'>
							<span className='block text-sm font-medium text-ctp-subtext0'>Дата создания</span>
							{/* <span className='block text-lg text-ctp-sapphire'>{formatDate(user?.createdAt)}</span> */}
						</div>
						<div>
							<span className='block text-sm font-medium text-ctp-subtext0'>Дата обновления</span>
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
