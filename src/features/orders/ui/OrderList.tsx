'use client';

import { OrderSearchListResult } from '@servemate/dto';

import UserListSkeleton from '@/features/users/ui/UserListSkeleton';
import { OrderCard } from './OrderCard';

interface OrderListProps {
	isLoading?: boolean;
	orders: OrderSearchListResult['orders'] | undefined;
	pageSize: number;
}

export function OrderList({ isLoading, orders, pageSize }: OrderListProps) {
	if (isLoading) {
		return <UserListSkeleton pageSize={pageSize} />;
	}
	if (!orders || orders.length === 0) {
		return <div className='text-center text-gray-500'>No orders found</div>;
	}

	return (
		<div className='space-y-4' style={{ minHeight: 'inherit' }}>
			{orders.map((order) => (
				<OrderCard key={order.id} order={order} />
			))}
		</div>
	);
}
