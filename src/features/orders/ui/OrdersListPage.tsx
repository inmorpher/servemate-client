'use client';

import Pagination from '@/shared/components/pagination/Paginations';
import { SearchError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { useEffect } from 'react';
import { useGetOrders } from '../hooks/useGetOrders';
import { OrderFilters } from './OrderFilters';
import { OrderList } from './OrderList';

export const OrdersListPage = () => {
	const {
		data: ordersData,
		isLoading,
		isFetching,
		error,
		isError,
		orderSearchCriteria,
		refetch,
		updateSearchCriteria,
	} = useGetOrders();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [orderSearchCriteria]);

	const { totalCount, pageSize, page, totalPages } = ordersData || {};

	const handlePageChange = (newPage: number) => {
		updateSearchCriteria({ page: newPage });
	};

	const handlePageSizeChange = (newSize: number) => {
		updateSearchCriteria({ pageSize: newSize, page: 1 });
	};

	return (
		<ListPageLayout
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
			filters={<OrderFilters />}
		>
			{isError ? (
				<SearchError error={error.message} refetch={refetch} />
			) : (
				<OrderList
					isFetching={isFetching}
					isLoading={isLoading}
					orders={ordersData?.orders}
					pageSize={pageSize ?? 10}
				/>
			)}
		</ListPageLayout>
	);
};
