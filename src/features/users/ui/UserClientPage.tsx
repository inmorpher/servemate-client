'use client';

import Pagination from '@/shared/components/pagination/Paginations';

import { useGetUsers } from '../hooks/useUsers';

import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import { UserSearchCriteria } from '@servemate/dto';
import { useQueryClient } from '@tanstack/react-query';
import { ViewTransition } from 'react';
import { UserList } from './UserList';
import UserSearchBar from './UserSearchBar';

const fetchWithQuery = async (entity: string, filters: UserSearchCriteria) => {
	const queryClient = useQueryClient();
	const queryString = buildQueryParams(filters);
	await queryClient.prefetchQuery({
		queryKey: [entity, filters],
		queryFn: () => {
			fetch(`/api/service/${entity}?${queryString}`).then((res) => res.json());
		},
	});
};
/**
 * Renders the user management page for clients, including search, pagination, and user list.
 *
 * This component fetches user data based on search criteria, displays a search bar,
 * paginated user list, and handles loading and error states.
 *
 * @returns {JSX.Element} The user client page layout with search, pagination, and user list.
 */
const UserClientPage = ({ tabId }: { tabId: Tab['id'] }) => {
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
				Filters={
					<UserSearchBar
						isLoading={isLoading}
						updateCriteria={updateSearchCriteria}
						criteria={userSearchCriteria}
					/>
				}
				Footer={
					<Pagination
						totalCount={totalCount ?? 0}
						totalPages={totalPages ?? 1}
						currentPage={page ?? 1}
						pageSize={pageSize ?? 10}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
					/>
				}
				Content={
					<UserList isLoading={isLoading} users={users} pageSize={effectivePageSize} />
				}
			></ListPageLayout>
		</ViewTransition>
	);
};

export default UserClientPage;
