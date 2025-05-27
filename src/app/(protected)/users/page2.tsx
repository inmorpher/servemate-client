'use client';
// import { userActions } from '@/features/users/api';
import Link from 'next/link';

// Простой компонент иконки загрузки
function LoadingIcon({ className = '' }) {
	return (
		<svg
			className={`animate-spin ${className}`}
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
		>
			<circle
				className='opacity-25'
				cx='12'
				cy='12'
				r='10'
				stroke='currentColor'
				strokeWidth='4'
			></circle>
			<path
				className='opacity-75'
				fill='currentColor'
				d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
			></path>
		</svg>
	);
}

// Компонент пагинации
function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	// Создаем массив страниц для отображения
	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Если страниц мало, показываем все
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Всегда показываем первую страницу
			pages.push(1);

			// Определяем диапазон видимых страниц вокруг текущей
			let startPage = Math.max(2, currentPage - 1);
			let endPage = Math.min(totalPages - 1, currentPage + 1);

			// Если мы близко к началу, сдвигаем диапазон вправо
			if (currentPage <= 3) {
				endPage = Math.min(totalPages - 1, 4);
			}

			// Если мы близко к концу, сдвигаем диапазон влево
			if (currentPage >= totalPages - 2) {
				startPage = Math.max(2, totalPages - 3);
			}

			// Добавляем многоточие после первой страницы, если нужно
			if (startPage > 2) {
				pages.push('...');
			}

			// Добавляем страницы из диапазона
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			// Добавляем многоточие перед последней страницей, если нужно
			if (endPage < totalPages - 1) {
				pages.push('...');
			}

			// Всегда показываем последнюю страницу
			pages.push(totalPages);
		}

		return pages;
	};

	const pages = getPageNumbers();

	return (
		<div className='flex items-center justify-center space-x-1 mt-4'>
			<button
				onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={`px-3 py-1 rounded-md ${
					currentPage === 1
						? 'bg-ctp-surface0 text-ctp-subtext0 cursor-not-allowed'
						: 'bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text transition-colors'
				}`}
			>
				&laquo;
			</button>

			{pages.map((page, index) => (
				<button
					key={index}
					onClick={() => typeof page === 'number' && onPageChange(page)}
					disabled={page === '...' || page === currentPage}
					className={`px-3 py-1 rounded-md ${
						page === currentPage
							? 'bg-ctp-blue text-ctp-base'
							: page === '...'
								? 'bg-transparent text-ctp-text cursor-default'
								: 'bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text transition-colors'
					}`}
				>
					{page}
				</button>
			))}

			<button
				onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={`px-3 py-1 rounded-md ${
					currentPage === totalPages
						? 'bg-ctp-surface0 text-ctp-subtext0 cursor-not-allowed'
						: 'bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text transition-colors'
				}`}
			>
				&raquo;
			</button>
		</div>
	);
}

// async function getUsersData(
// 	page: number = 1,
// 	limit: number = 10
// ): Promise<{
// 	users: UserListResult | null;
// 	error: string | null;
// 	currentPage: number;
// 	totalPages: number;
// }> {
// 	try {
// 		// Проверяем куки перед запросом

// 		// const { data: users, setCookie } = await serverFetch<UserListResult>('/api/users');

// 		console.log('cookies:', setCookie);

// 		// Вычисление общего количества страниц
// 		const totalPages = users ? Math.ceil(users.totalCount / limit) : 0;

// 		return {
// 			users,
// 			error: null,
// 			currentPage: page,
// 			totalPages,
// 		};
// 	} catch (err) {
// 		console.error('Error fetching users on server:', err);
// 		return {
// 			users: null,
// 			error: err instanceof Error ? err.message : 'Не удалось загрузить пользователей',
// 			currentPage: page,
// 			totalPages: 0,
// 		};
// 	}
// }

const getUsersData = async () => {
	const response = await fetch('/api/users');
	if (!response.ok) {
		console.log('Error fetching users:', response.statusText);
	}

	const data = await response.json();

	console.log('Fetched users:', data);
	return data;
};

export default function UsersPage({ searchParams }: { searchParams: { page?: string } }) {
	// Используем await для получения параметров URL
	const params = await new Promise<{ page?: string }>((resolve) => resolve(searchParams));

	// Получаем текущую страницу из параметров запроса или используем 1 по умолчанию
	const currentPage = params.page ? parseInt(params.page, 10) : 1;
	const limit = 10; // Количество элементов на странице

	const { users, error, totalPages } = await getUsersData();

	return (
		<div className='container mx-auto py-8 px-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold text-ctp-text'>Пользователи</h1>
				<Link
					href={`/users?page=${currentPage}`}
					className='px-4 py-2 bg-ctp-blue hover:bg-ctp-sapphire text-ctp-base rounded-md transition-colors flex items-center'
				>
					<svg className='h-4 w-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
						/>
					</svg>
					Обновить
				</Link>
			</div>

			{error && (
				<div className='bg-ctp-red bg-opacity-20 border border-ctp-red text-ctp-red px-4 py-3 rounded-md mb-6'>
					{error}
				</div>
			)}

			{!users && !error ? (
				<div className='flex justify-center items-center py-12'>
					<LoadingIcon className='h-8 w-8 text-ctp-blue' />
				</div>
			) : (
				<>
					<div className='rounded-lg border border-ctp-surface0 shadow overflow-hidden bg-ctp-mantle'>
						<table className='min-w-full divide-y divide-ctp-surface0'>
							<thead className='bg-ctp-surface0'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
										ID
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
										Имя
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
										Email
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
										Роль
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
										Действия
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-ctp-surface0'>
								{users && users.totalCount > 0 ? (
									users.users.map((user) => (
										<tr key={user.id} className='hover:bg-ctp-surface0 transition-colors'>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-ctp-subtext1'>
												{user.id}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-ctp-text font-medium'>
												{user.name}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-ctp-blue'>
												{user.email}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm'>
												<span
													className={`px-2 py-1 rounded-full text-xs ${
														user.role === 'ADMIN'
															? 'bg-ctp-mauve bg-opacity-30 text-ctp-mauve'
															: 'bg-ctp-green bg-opacity-30 text-ctp-green'
													}`}
												>
													{user.role}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm space-x-2'>
												<Link
													href={`/users/${user.id}`}
													className='text-ctp-blue hover:text-ctp-sapphire transition-colors'
												>
													Просмотр
												</Link>
												<Link
													href={`/users/${user.id}/edit`}
													className='text-ctp-green hover:text-ctp-teal transition-colors'
												>
													Изменить
												</Link>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={5} className='px-6 py-10 text-center text-sm text-ctp-subtext0'>
											{users && users.totalCount === 0
												? 'Пользователи не найдены'
												: 'Нет данных для отображения'}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Пагинация для серверного компонента через ссылки */}
					{users && users.totalCount > 0 && totalPages > 1 && (
						<div className='flex items-center justify-center space-x-1 mt-4'>
							<Link
								href={currentPage > 1 ? `/users?page=${currentPage - 1}` : '#'}
								className={`px-3 py-1 rounded-md ${
									currentPage === 1
										? 'bg-ctp-surface0 text-ctp-subtext0 cursor-not-allowed pointer-events-none'
										: 'bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text transition-colors'
								}`}
							>
								&laquo;
							</Link>

							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								const page = i + 1;
								return (
									<Link
										key={page}
										href={`/users?page=${page}`}
										className={`px-3 py-1 rounded-md ${
											page === currentPage
												? 'bg-ctp-blue text-ctp-base'
												: 'bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text transition-colors'
										}`}
									>
										{page}
									</Link>
								);
							})}

							{totalPages > 5 && (
								<>
									<span className='px-3 py-1'>...</span>
									<Link
										href={`/users?page=${totalPages}`}
										className='px-3 py-1 rounded-md bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text transition-colors'
									>
										{totalPages}
									</Link>
								</>
							)}

							<Link
								href={currentPage < totalPages ? `/users?page=${currentPage + 1}` : '#'}
								className={`px-3 py-1 rounded-md ${
									currentPage === totalPages
										? 'bg-ctp-surface0 text-ctp-subtext0 cursor-not-allowed pointer-events-none'
										: 'bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text transition-colors'
								}`}
							>
								&raquo;
							</Link>
						</div>
					)}
				</>
			)}
		</div>
	);
}
