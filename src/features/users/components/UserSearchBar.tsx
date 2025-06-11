import { debounce } from '@/shared/utils/devounce';
import { UserRole, UserSearchCriteria, UserSortColumn } from '@servemate/dto';
import { useCallback, useMemo, useState } from 'react';

function UserSearchBar({
	criteria,
	onCriteriaChange,
	onSearch,
	isLoading,
}: {
	criteria: UserSearchCriteria;
	onCriteriaChange: (criteria: UserSearchCriteria) => void;
	onSearch: () => void;
	isLoading: boolean;
}) {
	const [searchValue, setSearchValue] = useState(criteria.name || '');

	// Shallow URL update БЕЗ серверного запроса
	const updateUrlShallow = useCallback((newCriteria: UserSearchCriteria) => {
		const url = new URL(window.location.href);
		url.search = '';

		Object.entries(newCriteria).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				url.searchParams.set(key, String(value));
			}
		});

		window.history.replaceState({}, '', url.toString());
	}, []);

	// Debounced поиск БЕЗ серверного запроса
	const debouncedSearch = useMemo(
		() =>
			debounce((value: string) => {
				const newCriteria = { ...criteria, name: value, page: 1 };

				// Обновляем URL для шаринга/истории
				updateUrlShallow(newCriteria);

				// Тригерим клиентский поиск
				onCriteriaChange(newCriteria);
			}, 500),
		[criteria, updateUrlShallow, onCriteriaChange]
	);

	const handleOnInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;
			setSearchValue(value);

			if (value.trim().length < 3 && value.trim().length > 0) {
				return; // Не ищем, если меньше 3 символов
			}

			debouncedSearch(value.trim());
		},
		[debouncedSearch]
	);

	// Для остальных фильтров - клиентское обновление
	const handleCriteriaChange = useCallback(
		(newCriteria: UserSearchCriteria) => {
			// Обновляем URL БЕЗ серверного запроса
			updateUrlShallow(newCriteria);

			// Тригерим клиентский поиск/фильтрацию
			onCriteriaChange(newCriteria);
		},
		[updateUrlShallow, onCriteriaChange]
	);

	// Обработчик для явного поиска (Enter или кнопка)
	const handleExplicitSearch = useCallback(() => {
		const newCriteria = { ...criteria, name: searchValue.trim(), page: 1 };
		updateUrlShallow(newCriteria);
		onCriteriaChange(newCriteria);
	}, [criteria, searchValue, updateUrlShallow, onCriteriaChange]);

	return (
		<div className='bg-ctp-base/20 backdrop-blur-md border border-ctp-surface0/30 shadow-2xl drop-shadow-lg py-4 px-6  top-0 z-10 w-full mb-4 '>
			<div className='space-y-4'>
				{/* Input field */}
				<div className='flex items-center gap-3'>
					<div className='relative flex-grow'>
						<input
							type='text'
							placeholder='Users search...'
							value={searchValue}
							onChange={handleOnInputChange}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleExplicitSearch(); // БЕЗ серверного запроса
								}
							}}
							className='w-full px-4 py-2 pl-10 text-sm bg-ctp-surface0 border border-ctp-surface1 rounded-lg text-ctp-text placeholder-ctp-subtext0 focus:outline-none focus:ring-2 focus:ring-ctp-blue focus:border-transparent'
						/>
						<svg
							className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ctp-subtext0'
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

					<button
						onClick={handleExplicitSearch} // БЕЗ серверного запроса
						disabled={isLoading}
						className='px-4 py-2 bg-ctp-blue text-ctp-base text-sm font-medium rounded-lg hover:bg-ctp-sapphire disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
					>
						{isLoading ? (
							<>
								<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-ctp-base'></div>
								<span>Searching...</span>
							</>
						) : (
							<>
								<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
									/>
								</svg>
								<span>Find</span>
							</>
						)}
					</button>
				</div>

				{/* Фильтры */}
				<div className='flex flex-wrap items-center gap-3'>
					{/* Role filter */}
					<select
						value={criteria.role || ''}
						onChange={(e) =>
							handleCriteriaChange({
								// БЕЗ серверного запроса
								...criteria,
								role: e.target.value as UserRole,
								page: 1,
							})
						}
						className='px-3 py-1.5 text-sm bg-ctp-surface0 border border-ctp-surface1 rounded-md text-ctp-text focus:outline-none focus:ring-2 focus:ring-ctp-blue'
					>
						<option value=''>All Roles</option>
						<option value='USER'>User</option>
						<option value='ADMIN'>Admin</option>
						<option value='HOST'>Host</option>
						<option value='MANAGER'>Manager</option>
					</select>

					{/* Activity filter */}
					<select
						value={criteria.isActive === undefined ? '' : criteria.isActive.toString()}
						onChange={(e) =>
							handleCriteriaChange({
								// БЕЗ серверного запроса
								...criteria,
								isActive: e.target.value === '' ? undefined : e.target.value === 'true',
								page: 1,
							})
						}
						className='px-3 py-1.5 text-sm bg-ctp-surface0 border border-ctp-surface1 rounded-md text-ctp-text focus:outline-none focus:ring-2 focus:ring-ctp-blue'
					>
						<option value=''>All statuses</option>
						<option value='true'>Active</option>
						<option value='false'>Not active</option>
					</select>

					{/* Sort field */}
					<select
						value={criteria.sortBy || 'name'}
						onChange={(e) =>
							handleCriteriaChange({
								// БЕЗ серверного запроса
								...criteria,
								sortBy: e.target.value as UserSortColumn,
								page: 1,
							})
						}
						className='px-3 py-1.5 text-sm bg-ctp-surface0 border border-ctp-surface1 rounded-md text-ctp-text focus:outline-none focus:ring-2 focus:ring-ctp-blue'
					>
						<option value='name'>By name</option>
						<option value='email'>By email</option>
						<option value='role'>By role</option>
						<option value='createdAt'>By date of creation</option>
						<option value='updatedAt'>By date of updated</option>
						<option value='lastLogin'>By last login</option>
					</select>

					{/* Sort order */}
					<button
						onClick={() =>
							handleCriteriaChange({
								// БЕЗ серверного запроса
								...criteria,
								sortOrder: criteria.sortOrder === 'asc' ? 'desc' : 'asc',
								page: 1,
							})
						}
						className='px-3 py-1.5 text-sm bg-ctp-surface0 border border-ctp-surface1 rounded-md text-ctp-text hover:bg-ctp-surface1 transition-colors flex items-center gap-1'
					>
						{criteria.sortOrder === 'desc' ? '↓' : '↑'}
						{criteria.sortOrder === 'desc' ? 'Desc.' : 'Asc.'}
					</button>

					{/* Reset */}
					<button
						onClick={() => {
							const resetCriteria: UserSearchCriteria = {
								name: '',
								sortBy: 'name',
								sortOrder: 'asc',
								page: 1,
								pageSize: 10,
							};
							setSearchValue('');
							handleCriteriaChange(resetCriteria); // БЕЗ серверного запроса
						}}
						className='px-3 py-1.5 text-sm text-ctp-red hover:bg-ctp-red hover:bg-opacity-10 rounded-md transition-colors'
					>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
}

export default UserSearchBar;
