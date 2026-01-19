'use client';

import { List } from '@/shared/layouts/List';
import { OrderSearchListResult } from '@servemate/dto';
import { ViewTransition } from 'react';
import { OrderCard } from './OrderCard';

interface OrderListProps {
	isLoading?: boolean;
	orders: OrderSearchListResult['orders'] | undefined;
	pageSize: number;
	isFetching?: boolean;
	viewMode: 'list' | 'grid';
}

/**
 * Renders orders in list or grid view based on user preference
 * List view is limited to max-w-3xl for better readability on large screens
 */
export const OrderList = ({
	isLoading,
	orders,
	pageSize,
	isFetching,
	viewMode,
}: OrderListProps) => {
	return (
		<ViewTransition>
			<List
				items={orders}
				ItemComponent={(order) => <OrderCard order={order} />}
				isLoading={isLoading}
				isFetching={isFetching}
				skeletonCount={pageSize}
				emptyMessage='No orders found'
				gridClassName={
					viewMode === 'grid'
						? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
						: undefined
				}
				className={viewMode === 'list' ? 'max-w-3xl' : undefined}
			/>
		</ViewTransition>
	);
};
