'use client';

import { Pagination } from '@/shared/components/pagination';
import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout2';
import { OrderSearchCriteria } from '@servemate/dto';
import type { ComponentType, ReactNode } from 'react';
import { useGetOrdersAndMeta } from '../hooks/useGetOrdersAndMeta';
import OrderFilters from './OrderFilters';
import { OrderListTest } from './OrderListTest';

const OrdersPageLayout = ListPageLayout as unknown as ComponentType<{
	Filters?: ReactNode;
	Content?: ReactNode;
	Footer?: ReactNode;
}>;

export const OrdersListPage = () => {
	const currentTab: Tab<OrderSearchCriteria> | undefined = useTabs((state) =>
		state.getTabById(state.activeTabId),
	);
	const updateTab = useTabs((state) => state.updateTab);
	const filters = currentTab?.filters;
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

	const { orders } = useGetOrdersAndMeta(filters || {});
	const { data, error, isError, isLoading, refetch } = orders;

	if (isError || currentTab === undefined) {
		return <ListError error={error?.message} refetch={refetch} isLoading={isLoading} />;
	}

	return (
		<OrdersPageLayout
			Filters={<OrderFilters />}
			Content={
				<OrderListTest
					orders={data?.orders}
					isLoading={isLoading}
					onSortChange={handleSortChange}
					sortBy={filters?.sortBy}
					sortOrder={filters?.sortOrder}
				/>
			}
			Footer={
				<Pagination
					totalCount={data?.totalCount || 0}
					totalPages={data?.totalPages || 0}
					currentPage={filters?.page || 1}
					pageSize={filters?.pageSize || 10}
					onPageSizeChange={(pageSize) =>
						updateTab(currentTab.id, {
							filters: {
								...(filters || {}),
								pageSize,
							},
						})
					}
					onPageChange={(page) =>
						updateTab(currentTab.id, {
							filters: {
								...(filters || {}),
								page,
							},
						})
					}
				/>
			}
		/>
	);
};

export default OrdersListPage;
