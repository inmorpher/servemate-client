'use client';

import Pagination from '@/shared/components/pagination/Paginations';

import { useEffect } from 'react';
import { useGetUsers } from '../hooks/useUsers';

import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { SearchError } from '../../../shared/layouts/Error';
import { UserList } from './UserList';
import UserSearchBar from './UserSearchBar';

/**
 * Renders the user management page for clients, including search, pagination, and user list.
 *
 * This component fetches user data based on search criteria, displays a search bar,
 * paginated user list, and handles loading and error states.
 *
 * @returns {JSX.Element} The user client page layout with search, pagination, and user list.
 */
export const UserClientPage = () => {
	const { isLoading, data, isError, error, refetch, updateSearchCriteria, userSearchCriteria } =
		useGetUsers();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [userSearchCriteria]);

	const handlePageChange = (newPage: number) => {
		updateSearchCriteria({ page: newPage });
	};

	const handlePageSizeChange = (newSize: number) => {
		updateSearchCriteria({ pageSize: newSize, page: 1 });
	};

	const { users, totalCount, totalPages, page, pageSize } = data || {};

	const effectivePageSize = pageSize ?? userSearchCriteria.pageSize ?? 10;
	return (
		<ListPageLayout
			filters={
				<UserSearchBar
					isLoading={isLoading}
					updateCriteria={updateSearchCriteria}
					criteria={userSearchCriteria}
				/>
			}
			footer={
				<Pagination
					totalCount={totalCount ?? 0}
					totalPages={totalPages ?? 1}
					currentPage={page ?? 1}
					pageSize={pageSize ?? 10}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			}
		>
			{isError ? (
				<SearchError error={error.message} refetch={refetch} />
			) : (
				<UserList isLoading={isLoading} users={users} pageSize={effectivePageSize} />
			)}
		</ListPageLayout>
	);
};
