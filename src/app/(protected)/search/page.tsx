import { UserListItem } from '@servemate/dto';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Компонент иконки загрузки
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

// Функция фильтрации пользователей по запросу
const filterItems = (items: UserListItem[], query: string): UserListItem[] => {
	if (!query || query.trim() === '') return items;

	const lowerQuery = query.toLowerCase().trim();
	return items.filter(
		(item) =>
			item.name.toLowerCase().includes(lowerQuery) ||
			item.email.toLowerCase().includes(lowerQuery) ||
			item.role.toLowerCase().includes(lowerQuery)
	);
};

// Функция сортировки пользователей
const sortItems = (items: UserListItem[], ascending: boolean): UserListItem[] => {
	return [...items].sort((a, b) => {
		if (ascending) {
			return a.name.localeCompare(b.name);
		} else {
			return b.name.localeCompare(a.name);
		}
	});
};

// Компонент пагинации для клиентских компонентов
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
				disabled={currentPage === totalPages || totalPages === 0}
				className={`px-3 py-1 rounded-md ${
					currentPage === totalPages || totalPages === 0
						? 'bg-ctp-surface0 text-ctp-subtext0 cursor-not-allowed'
						: 'bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text transition-colors'
				}`}
			>
				&raquo;
			</button>
		</div>
	);
}

export default function SearchPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [query, setQuery] = useState(searchParams.get('q') || '');
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState<UserListItem[]>([]);
	const [filteredResults, setFilteredResults] = useState<UserListItem[]>([]);
	const [ascending, setAscending] = useState(true);
	const [showResults, setShowResults] = useState(false);

	// Пагинация
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 5;
	const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);

	// Вычисление текущей страницы результатов
	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return filteredResults.slice(startIndex, endIndex);
	};

	// Обновление URL с параметрами поиска
	const updateSearchParams = (newQuery: string, newPage: number = 1) => {
		const params = new URLSearchParams();
		if (newQuery) params.set('q', newQuery);
		params.set('page', newPage.toString());
		params.set('sort', ascending ? 'asc' : 'desc');

		router.push(`/search?${params.toString()}`);
	};

	// Форматирование даты в русской локализации
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
			}).format(date);
		} catch (error) {
			console.error('Ошибка форматирования даты:', error);
			return 'Некорректная дата';
		}
	};

	// Обработка поиска
	const handleSearch = () => {
		setIsLoading(true);
		setCurrentPage(1); // Сброс на первую страницу при новом поиске

		// Обновляем URL с параметрами поиска
		updateSearchParams(query);

		// Имитация запроса к API
		setTimeout(() => {
			// Тестовые данные для демонстрации
			const data: UserListItem[] = [
				{
					id: 1,
					name: 'Администратор',
					email: 'admin@example.com',
					role: 'ADMIN',
					createdAt: new Date('2024-01-15'),
					updatedAt: new Date('2024-03-20'),
					isActive: true,
					lastLogin: new Date('2024-04-10'),
				},
				{
					id: 2,
					name: 'Пользователь',
					email: 'user@example.com',
					role: 'USER',
					createdAt: new Date('2024-02-10'),
					updatedAt: new Date('2024-02-10'),
					isActive: true,
					lastLogin: null,
				},
				{
					id: 3,
					name: 'Модератор',
					email: 'moderator@example.com',
					role: 'MODERATOR',
					createdAt: new Date('2024-01-05'),
					updatedAt: new Date('2024-03-15'),
					isActive: true,
					lastLogin: new Date('2024-03-28'),
				},
				{
					id: 4,
					name: 'Тестовый пользователь',
					email: 'test@example.com',
					role: 'USER',
					createdAt: new Date('2023-12-20'),
					updatedAt: new Date('2024-02-05'),
					isActive: false,
					lastLogin: new Date('2024-01-20'),
				},
				{
					id: 5,
					name: 'Аналитик',
					email: 'analyst@example.com',
					role: 'USER',
					createdAt: new Date('2024-02-25'),
					updatedAt: new Date('2024-03-01'),
					isActive: true,
					lastLogin: new Date('2024-04-01'),
				},
				{
					id: 6,
					name: 'Менеджер',
					email: 'manager@example.com',
					role: 'MANAGER',
					createdAt: new Date('2023-11-15'),
					updatedAt: new Date('2024-01-10'),
					isActive: true,
					lastLogin: new Date('2024-04-15'),
				},
			];

			setResults(data);

			// Фильтруем и сортируем результаты
			const filtered = filterItems(data, query);
			const sorted = sortItems(filtered, ascending);
			setFilteredResults(sorted);
			setShowResults(true);
			setIsLoading(false);
		}, 800);
	};

	// Изменение страницы
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		updateSearchParams(query, page);
	};

	// Обработка изменения сортировки
	const handleSortChange = () => {
		const newAscending = !ascending;
		setAscending(newAscending);
		setFilteredResults(sortItems(filteredResults, newAscending));
		updateSearchParams(query, currentPage);
	};

	// Выполнение поиска при загрузке страницы, если есть параметры в URL
	useEffect(() => {
		const urlQuery = searchParams.get('q');
		const urlPage = searchParams.get('page');
		const urlSort = searchParams.get('sort');

		if (urlQuery) {
			setQuery(urlQuery);
		}

		if (urlSort) {
			setAscending(urlSort === 'asc');
		}

		if (urlPage) {
			const page = parseInt(urlPage, 10);
			if (!isNaN(page) && page > 0) {
				setCurrentPage(page);
			}
		}

		// Если есть параметр поиска, выполняем поиск автоматически
		if (urlQuery) {
			handleSearch();
		}
	}, [searchParams]);

	return (
		<>
			{/* Минималистичная шапка с поиском */}
			<div className='bg-ctp-base border-b border-ctp-surface0 shadow-sm py-3 px-4 sticky top-0 z-10'>
				<div className='container mx-auto'>
					<div className='flex items-center gap-3'>
						<div className='relative flex-grow'>
							<input
								type='text'
								placeholder='Быстрый поиск...'
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
								className='w-full px-4 py-2 pl-10 rounded-lg bg-ctp-mantle border border-ctp-surface0 text-ctp-text text-sm focus:outline-none focus:ring-1 focus:ring-ctp-mauve'
							/>
							<svg
								className='absolute left-3 top-2.5 h-4 w-4 text-ctp-subtext0'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
						</div>

						{/* Кнопка поиска */}
						<button
							onClick={handleSearch}
							disabled={isLoading}
							className='px-4 py-2 bg-ctp-blue hover:bg-ctp-sapphire text-ctp-base rounded-lg text-sm transition duration-200 disabled:opacity-50 flex items-center'
						>
							{isLoading ? (
								<>
									<LoadingIcon className='w-4 h-4 mr-2' />
									<span>Поиск...</span>
								</>
							) : (
								<span>Найти</span>
							)}
						</button>

						{/* Кнопка сортировки */}
						<button
							onClick={handleSortChange}
							className='p-2 bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-subtext0 rounded-lg transition duration-200'
							title={`Сортировка: ${ascending ? 'По возрастанию' : 'По убыванию'}`}
						>
							{ascending ? (
								<svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12'
									/>
								</svg>
							) : (
								<svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4'
									/>
								</svg>
							)}
						</button>

						{/* Кнопка обновления */}
						<button
							onClick={() => {
								setQuery('');
								setResults([]);
								setFilteredResults([]);
								setShowResults(false);
								setCurrentPage(1);
								router.push('/search');
							}}
							className='p-2 bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-subtext0 rounded-lg transition duration-200'
							title='Сбросить'
						>
							<svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Результаты поиска */}
			<div className='container mx-auto my-4 px-4'>
				{isLoading ? (
					<div className='flex justify-center items-center py-20'>
						<LoadingIcon className='h-12 w-12 text-ctp-mauve' />
					</div>
				) : showResults ? (
					<>
						<div className='bg-ctp-mantle rounded-lg shadow-sm overflow-hidden border border-ctp-surface0'>
							<div className='p-3 bg-ctp-surface0 border-b border-ctp-surface1'>
								<h2 className='text-sm font-medium text-ctp-subtext0'>
									Результаты поиска{query ? `: "${query}"` : ''}
									<span className='ml-2 text-xs text-ctp-subtext1'>
										{filteredResults.length} найдено
									</span>
								</h2>
							</div>

							{filteredResults.length === 0 ? (
								<div className='text-center py-8 text-ctp-subtext0 text-sm'>
									<svg
										className='mx-auto h-12 w-12 text-ctp-surface2'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={1.5}
											d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
									<p className='mt-2'>По вашему запросу ничего не найдено</p>
								</div>
							) : (
								<div className='overflow-x-auto'>
									<table className='min-w-full'>
										<thead>
											<tr className='border-b border-ctp-surface1'>
												<th className='py-2 px-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
													Имя
												</th>
												<th className='py-2 px-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
													Email
												</th>
												<th className='py-2 px-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
													Роль
												</th>
												<th className='py-2 px-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
													Статус
												</th>
												<th className='py-2 px-3 text-left text-xs font-medium uppercase tracking-wider text-ctp-subtext0'>
													Создан
												</th>
											</tr>
										</thead>
										<tbody>
											{getCurrentPageItems().map((user) => (
												<tr
													key={user.id}
													className='border-b border-ctp-surface0 hover:bg-ctp-surface0 transition-colors'
												>
													<td className='py-2 px-3 text-sm text-ctp-peach font-medium'>
														<Link href={`/users/${user.id}`} className='hover:underline'>
															{user.name}
														</Link>
													</td>
													<td className='py-2 px-3 text-sm text-ctp-blue'>{user.email}</td>
													<td className='py-2 px-3 text-sm'>
														<span
															className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
																user.role === 'ADMIN'
																	? 'bg-ctp-mauve bg-opacity-30 text-ctp-mauve'
																	: user.role === 'MANAGER'
																		? 'bg-ctp-yellow bg-opacity-30 text-ctp-yellow'
																		: user.role === 'USER'
																			? 'bg-ctp-teal bg-opacity-30 text-ctp-teal'
																			: 'bg-ctp-green bg-opacity-30 text-ctp-green'
															}`}
														>
															{user.role}
														</span>
													</td>
													<td className='py-2 px-3 text-sm'>
														<span
															className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded ${
																user.isActive
																	? 'bg-ctp-green bg-opacity-30 text-ctp-green'
																	: 'bg-ctp-red bg-opacity-30 text-ctp-red'
															}`}
														>
															{user.isActive ? 'Активен' : 'Неактивен'}
														</span>
													</td>
													<td className='py-2 px-3 text-sm text-ctp-sapphire'>
														{formatDate(user.createdAt)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>

						{/* Пагинация */}
						{filteredResults.length > ITEMS_PER_PAGE && (
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						)}
					</>
				) : (
					<div className='flex flex-col items-center justify-center py-16 text-center'>
						<svg
							className='h-16 w-16 text-ctp-overlay0'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1}
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							/>
						</svg>
						<h3 className='mt-4 text-lg font-medium text-ctp-text'>Введите поисковый запрос</h3>
						<p className='mt-1 text-sm text-ctp-subtext0'>
							Используйте поиск для нахождения нужных вам пользователей
						</p>
					</div>
				)}
			</div>
		</>
	);
}
