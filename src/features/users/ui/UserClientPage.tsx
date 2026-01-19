'use client';

import Pagination from '@/shared/components/pagination/Paginations';

import { useGetUsers } from '../hooks/useUsers';

import { Tab } from '@/features/tabs/types/tabs.type';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { ViewTransition } from 'react';
import { UserList } from './UserList';

/**
 * Renders the user management page for clients, including search, pagination, and user list.
 *
 * This component fetches user data based on search criteria, displays a search bar,
 * paginated user list, and handles loading and error states.
 *
 * @returns {JSX.Element} The user client page layout with search, pagination, and user list.
 */
export const UserClientPage = ({ tabId }: { tabId: Tab['id'] }) => {
	const { isLoading, data, updateSearchCriteria, userSearchCriteria } = useGetUsers();

	// useEffect(() => {
	// 	window.scrollTo({
	// 		top: 0,
	// 		behavior: 'smooth',
	// 	});
	// }, [userSearchCriteria]);

	const handlePageChange = (newPage: number) => {
		updateSearchCriteria({ page: newPage });
	};

	const handlePageSizeChange = (newSize: number) => {
		updateSearchCriteria({ pageSize: newSize, page: 1 });
	};

	const { users, totalCount, totalPages, page, pageSize } = data || {};

	const effectivePageSize = pageSize ?? userSearchCriteria.pageSize ?? 10;
	return (
		<ViewTransition>
			<input
				type='text'
				placeholder='Search users...'
				className='mb-4 w-full rounded border p-2'
			/>
			<ListPageLayout
				// renderFilters={() => (
				// 	<UserSearchBar
				// 		isLoading={isLoading}
				// 		updateCriteria={updateSearchCriteria}
				// 		criteria={userSearchCriteria}
				// 	/>
				// )}
				renderFooter={() => (
					<Pagination
						totalCount={totalCount ?? 0}
						totalPages={totalPages ?? 1}
						currentPage={page ?? 1}
						pageSize={pageSize ?? 10}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
					/>
				)}
				renderContent={() => (
					<UserList isLoading={isLoading} users={users} pageSize={effectivePageSize} />
				)}
			></ListPageLayout>
		</ViewTransition>
	);
};
