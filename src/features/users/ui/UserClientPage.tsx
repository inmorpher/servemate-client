'use client';

import { Pagination } from '@/shared/components/pagination';
import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { UserSearchCriteria } from '@servemate/dto';
import { ViewTransition } from 'react';
import { useGetUsers } from '../hooks/useUsers';
import UserSearchBar from './UserSearchBar';
import { UsersList } from './UsersList';
/**
 * Renders the user management page for clients, including search, pagination, and user list.
 *
 * This component fetches user data based on search criteria, displays a search bar,
 * paginated user list, and handles loading and error states.
 *
 * @returns {JSX.Element} The user client page layout with search, pagination, and user list.
 */

const UserClientPage = ({ tabId }: { tabId: Tab['id'] }) => {
	const currentTab: Tab<UserSearchCriteria> | undefined = useTabs((state) =>
		state.getTabById(tabId),
	);
	const updateTab = useTabs((state) => state.updateTab);
	const filters = currentTab?.filters;
	const { isLoading, data } = useGetUsers(filters || {});

	const handleSortChange = (sortBy: NonNullable<UserSearchCriteria['sortBy']>) => {
		if (!currentTab) {
			return;
		}

		const nextSortOrder =
			filters?.sortBy === sortBy && filters?.sortOrder === 'desc' ? 'asc' : 'desc';

		updateTab(currentTab.id, {
			filters: {
				...(filters || {}),
				sortBy,
				sortOrder: nextSortOrder,
				page: 1,
			},
		});
	};

	const handlePageChange = (newPage: number) => {
		if (!currentTab) {
			return;
		}

		updateTab(currentTab.id, {
			filters: {
				...(filters || {}),
				page: newPage,
			},
		});
	};

	const handlePageSizeChange = (newSize: number) => {
		if (!currentTab) {
			return;
		}

		updateTab(currentTab.id, {
			filters: {
				...(filters || {}),
				pageSize: newSize,
				page: 1,
			},
		});
	};

	const { users, totalCount, totalPages, page, pageSize } = data || {};

	const effectivePageSize = pageSize ?? filters?.pageSize ?? 10;
	return (
		<ViewTransition>
			<ListPageLayout>
				<ListPageLayout.Filters>
					<UserSearchBar />
				</ListPageLayout.Filters>

				<ListPageLayout.Content>
					<UsersList
						isLoading={isLoading}
						users={users}
						pageSize={effectivePageSize}
						totalCount={totalCount}
						sortBy={filters?.sortBy}
						sortOrder={filters?.sortOrder}
						onSortChange={handleSortChange}
					/>
				</ListPageLayout.Content>

				<ListPageLayout.Footer>
					<Pagination
						totalCount={totalCount ?? 0}
						totalPages={totalPages ?? 1}
						currentPage={page ?? filters?.page ?? 1}
						pageSize={pageSize ?? filters?.pageSize ?? 10}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
					/>
				</ListPageLayout.Footer>
			</ListPageLayout>
		</ViewTransition>
	);
};

export default UserClientPage;
