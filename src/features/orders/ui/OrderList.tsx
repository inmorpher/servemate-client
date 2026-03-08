'use client';

import { List } from '@/shared/layouts/List';
import { OrderSearchListResult } from '@servemate/dto';
import { startTransition, useState, ViewTransition } from 'react';
import { OrderCard } from './OrderCard';

interface OrderListProps {
	isLoading?: boolean;
	orders: OrderSearchListResult['orders'] | undefined;
	pageSize: number;
	totalCount?: number;
	isFetching?: boolean;
}

/**
 * Renders orders in list or grid view based on user preference
 * List view is limited to max-w-3xl for better readability on large screens
 */

export const OrderList = ({
	isLoading,
	orders,
	pageSize,
	totalCount,
	isFetching,
}: OrderListProps) => {
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

	const toggleHandler = () => {
		startTransition(() => {
			setViewMode(viewMode === 'list' ? 'grid' : 'list');
		});
	};
	return (
		<ViewTransition>
			<div className='flex items-center justify-between'>
				{/* Results count */}
				{totalCount !== undefined && (
					<div className='text-ctp-subtext1 text-sm'>
						Found <span className='text-ctp-text font-bold'>{totalCount}</span>
						orders
					</div>
				)}

				{/* View Mode Toggle */}
				<div className='bg-ctp-surface0 mb-5 flex items-center gap-2 rounded-lg p-1'>
					<button
						onClick={() => toggleHandler()}
						className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
							viewMode === 'list'
								? 'bg-ctp-surface1 text-ctp-text'
								: 'text-ctp-subtext0 hover:text-ctp-text'
						}`}
						title='List view'
					>
						<svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
							<path d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V17a2 2 0 01-2 2h-1C9.716 19 3 12.284 3 4V3z' />
						</svg>
						List
					</button>

					<button
						onClick={() => toggleHandler()}
						className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
							viewMode === 'grid'
								? 'bg-ctp-surface1 text-ctp-text'
								: 'text-ctp-subtext0 hover:text-ctp-text'
						}`}
						title='Grid view'
					>
						<svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
							<path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z' />
						</svg>
						Grid
					</button>
				</div>
			</div>
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
