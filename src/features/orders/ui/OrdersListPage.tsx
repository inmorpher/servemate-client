'use client';

import { Pagination } from '@/shared/components/pagination';
import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout2';
import { OrderSearchCriteria, OrderSearchListResult } from '@servemate/dto';
import OrderFilters from './OrderFilters';
import { OrderListTest } from './OrderListTest';

const OrdersListPage = () => {
	const currentTab: Tab<OrderSearchCriteria> | undefined = useTabs((state) =>
		state.getTabById(state.activeTabId),
	);
	const updateTab = useTabs((state) => state.updateTab);
	const filters = currentTab?.filters;
	console.log('filters', filters?.sortOrder);
	const handleSortChange = (sortBy: NonNullable<OrderSearchCriteria['sortBy']>) => {
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

	const { data, error, isError, isLoading, isFetching, refetch } =
		useApiQuery<OrderSearchListResult>('/orders', filters, {});

	if (isError || currentTab === undefined) {
		return <ListError error={error?.message} refetch={refetch} isLoading={isLoading} />;
	}

	return (
		<ListPageLayout>
			<ListPageLayout.Filters>
				<OrderFilters />
			</ListPageLayout.Filters>

			<ListPageLayout.Content>
				{/* <OrderList
					filters={filters}
					isFetching={isFetching}
					isLoading={isLoading}
					orders={data?.orders}
					totalCount={data?.totalCount}
					onSortChange={handleSortChange}
				/> */}
				{
					<OrderListTest
						orders={data?.orders}
						isLoading={isLoading}
						onSortChange={handleSortChange}
						sortBy={filters?.sortBy}
						sortOrder={filters?.sortOrder}
					/>
				}
			</ListPageLayout.Content>

			<ListPageLayout.Footer>
				<Pagination
					totalCount={data?.totalCount || 0}
					totalPages={data?.totalPages || 0}
					currentPage={filters?.page || 1}
					pageSize={filters?.pageSize || 10}
					onPageSizeChange={(pageSize) =>
						updateTab(currentTab?.id, {
							filters: {
								...(filters || {}),
								pageSize,
							},
						})
					}
					onPageChange={(page) =>
						updateTab(currentTab?.id, {
							filters: {
								...(filters || {}),
								page,
							},
						})
					}
				/>
			</ListPageLayout.Footer>
		</ListPageLayout>
	);
};

export default OrdersListPage;
