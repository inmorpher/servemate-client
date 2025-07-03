'use client';

import { OrderSearchListResult } from '@servemate/dto';

import UserListSkeleton from '@/shared/components/skeleton/ListSkeleton';
import { cn } from '@/shared/lib/classNames';
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
export function OrderList({ isLoading, orders, pageSize, isFetching }: OrderListProps) {
	console.log(isLoading);
	if (isLoading && !orders) {
		return <UserListSkeleton pageSize={pageSize} />;
	}
	if (!isLoading && (!orders || orders.length === 0)) {
		return <div className='text-center text-gray-500'>No orders found</div>;
	}

	return (
		<div
			className={cn('space-y-4 ', isFetching && 'animate-pulse')}
			style={{ minHeight: 'inherit' }}
		>
			{orders?.map((order) => (
				<OrderCard key={order.id} order={order} />
			))}
		</div>
	);
}
