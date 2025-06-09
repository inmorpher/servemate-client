'use client';

import SearchError from '@/features/users/components/Error';
import UserCard from '@/features/users/components/UserCard';
import UserSearchBar from '@/features/users/components/UserSearchBar';
import { useUsers } from '@/features/users/hooks/useUsers';
import Pagination from '@/shared/components/pagination/Paginations';

// Компонент поиска и фильтров

// Компонент пагинации

// Основной компонент
export function UsersPageContainer() {
	const {
		isError,
		isLoading,
		data,
		handleSearch,
		handlePageChange,
		handlePageSizeChange,
		refetch,
		userSearchCriteria,
		setUserSearchCriteria,
	} = useUsers();

	if (isError) {
		return <SearchError error='Failed to load users' refetch={refetch} />;
	}

	return (
		<div className='relative bg-ctp-mantle min-h-screen'>
			<UserSearchBar
				criteria={userSearchCriteria}
				onCriteriaChange={setUserSearchCriteria}
				onSearch={handleSearch}
				isLoading={isLoading}
			/>

			<div className='px-6 py-6'>
				{/* Заголовок и экспорт */}
				<div className='flex justify-between items-center mb-6'>
					<div>
						<h1 className='font-bold text-ctp-text text-2xl'>Пользователи</h1>
						{data && (
							<p className='mt-1 text-ctp-subtext0'>Найдено пользователей: {data.totalCount}</p>
						)}
					</div>

					<div className='flex items-center gap-3'>
						<button
							onClick={() => refetch()}
							disabled={isLoading}
							className='flex items-center gap-2 bg-ctp-green hover:bg-ctp-teal disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-ctp-base text-sm transition-colors disabled:cursor-not-allowed'
						>
							{isLoading ? (
								<div className='border-ctp-base border-b-2 rounded-full w-4 h-4 animate-spin'></div>
							) : (
								<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
									/>
								</svg>
							)}
							Обновить
						</button>

						{/* <button
							disabled={!data || !data.users.length}
							className='flex items-center gap-2 bg-ctp-yellow hover:bg-ctp-peach disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-ctp-base text-sm transition-colors disabled:cursor-not-allowed'
						>
							<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
								/>
							</svg>
							Экспорт
						</button> */}
					</div>
				</div>

				{/* Список пользователей */}
				{isLoading ? (
					<div className='space-y-4'>
						{[...Array(userSearchCriteria.pageSize || 10)].map((_, index) => (
							<div
								key={index}
								className='bg-ctp-surface0 p-4 border border-ctp-surface1 rounded-lg animate-pulse'
							>
								<div className='flex justify-between items-start'>
									<div className='flex-grow'>
										<div className='flex items-center gap-3 mb-2'>
											<div className='bg-ctp-surface1 rounded w-32 h-6'></div>
											<div className='bg-ctp-surface1 rounded w-16 h-5'></div>
											<div className='bg-ctp-surface1 rounded w-20 h-5'></div>
										</div>
										<div className='bg-ctp-surface1 mb-2 rounded w-48 h-4'></div>
										<div className='flex gap-4'>
											<div className='bg-ctp-surface1 rounded w-24 h-3'></div>
											<div className='bg-ctp-surface1 rounded w-24 h-3'></div>
											<div className='bg-ctp-surface1 rounded w-32 h-3'></div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : data && data.users.length > 0 ? (
					<div className='space-y-4'>
						{data.users.map((user) => (
							<UserCard key={user.id} user={user} />
						))}
					</div>
				) : (
					<div className='py-12 text-center'>
						<div className='mb-4 text-ctp-subtext0'>
							<svg
								className='mx-auto w-16 h-16'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
								/>
							</svg>
						</div>
						<h3 className='mb-2 font-semibold text-ctp-text text-lg'>Пользователи не найдены</h3>
						<p className='text-ctp-subtext0'>Попробуйте изменить критерии поиска</p>
					</div>
				)}
			</div>

			{/* Пагинация */}
			{data && data.users.length > 0 && (
				<Pagination
					currentPage={data.page}
					totalPages={data.totalPages}
					onPageChange={handlePageChange}
					pageSize={data.pageSize}
					onPageSizeChange={handlePageSizeChange}
					totalCount={data.totalCount}
				/>
			)}
		</div>
	);
}
