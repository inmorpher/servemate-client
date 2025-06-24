'use client';

import Pagination from '@/shared/components/pagination/Paginations';
import { ListPageLayout } from '@/shared/layouts/ListPageLayput';
import { useEffect } from 'react';
import { useGetOrders } from '../hooks/useGetOrders';
import { OrderList } from './OrderList';

export const OrdersListPage = () => {
	const {
		data: ordersData,
		isLoading,
		error,
		orderSearchCriteria,
		updateSearchCriteria,
	} = useGetOrders();
	console.log('Orders Data:', ordersData);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [orderSearchCriteria]);

	const { totalCount, pageSize, page, totalPages } = ordersData || {};
	const effectivePageSize = pageSize ?? orderSearchCriteria.pageSize ?? 10;
	return (
		<ListPageLayout
			header={<div className='p-4'>Orders Search Bar (Placeholder)</div>}
			footer={
				<Pagination
					data={{ totalCount, totalPages, page, pageSize }}
					updateSearchCriteria={updateSearchCriteria}
				/>
			}
		>
			<OrderList isLoading={isLoading} orders={ordersData?.orders} pageSize={10} />
		</ListPageLayout>
	);
};
