'use client';

import { OrderSearchListResult } from '@servemate/dto';

import { List } from '@/shared/layouts/List';
import { OrderCard } from './OrderCard';

interface OrderListProps {
	isLoading?: boolean;
	orders: OrderSearchListResult['orders'] | undefined;
	pageSize: number;
	isFetching?: boolean;
}

/**
 * Renders a list of orders or appropriate placeholders based on loading and data state.
 *
 * @param {OrderListProps} props - The props for the OrderList component.
 * @param {boolean} props.isLoading - Indicates if the order data is currently loading.
 * @param {Order[]} props.orders - The array of order objects to display.
 * @param {number} props.pageSize - The number of skeleton items to show while loading.
 * @returns {JSX.Element} The rendered order list, loading skeleton, or empty state message.
 */

export const OrderList = ({ isLoading, orders, pageSize, isFetching }: OrderListProps) => {
	console.log('pageSize', pageSize);
	return (
		<List
			items={orders}
			ItemComponent={(order) => <OrderCard order={order} />}
			isLoading={isLoading}
			isFetching={isFetching}
			skeletonCount={pageSize}
			emptyMessage='No orders found'
		/>
	);
};
