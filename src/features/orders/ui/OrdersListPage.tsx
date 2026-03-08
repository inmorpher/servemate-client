'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { OrderSearchListResult } from '@servemate/dto';
import { ViewTransition } from 'react';
import OrderFilters from './OrderFilters';
import { OrderList } from './OrderList';

interface OrdersListPageProps {
	tabId: Tab['id'];
}

const OrdersListPage = ({ tabId }: OrdersListPageProps) => {
	const { getTabById } = useTabs();
	const currentTab = getTabById(tabId);
	const filters = currentTab?.filters;
	console.log('Current Tab', currentTab);
	console.log('Current Filters', filters);

	const { data, error, isError, isLoading, isFetching, refetch } =
		useApiQuery<OrderSearchListResult>('/orders', filters, {});

	if (isError) {
		<ListError error={error?.message} refetch={refetch} isLoading={isLoading} />;
	}

	return (
		<ViewTransition>
			<ListPageLayout
				Filters={<OrderFilters />}
				Content={
					<OrderList
						isFetching={isFetching}
						isLoading={isLoading}
						orders={data?.orders}
						pageSize={10}
						totalCount={data?.totalCount}
					/>
				}
			/>
		</ViewTransition>
	);
};

export default OrdersListPage;
