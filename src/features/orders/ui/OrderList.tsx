'use client';

import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { cn } from '@/shared/utils/classNames';
import { OrderSearchCriteria, OrderSearchListResult } from '@servemate/dto';
import { ViewTransition } from 'react';
import { formatCurrency, formatDate, getStatusColor } from '../utils/orderHelpers';
import { OrderCard } from './OrderCard';

interface OrderListProps {
	isLoading?: boolean;
	orders: OrderSearchListResult['orders'] | undefined;

	totalCount?: number;
	isFetching?: boolean;
	filters?: Partial<OrderSearchCriteria>;
	onSortChange: (sortBy: NonNullable<OrderSearchCriteria['sortBy']>) => void;
}

type OrderListItem = OrderSearchListResult['orders'][number];

type OrderSortKey = NonNullable<OrderSearchCriteria['sortBy']>;

type OrderColumn = (typeof columns)[number];

const columns: Array<{ label: string; sortBy: OrderSortKey; alignRight?: boolean }> = [
	{ label: 'Order', sortBy: 'id' as OrderSortKey },
	{ label: 'Status', sortBy: 'status' as OrderSortKey },
	{ label: 'Table', sortBy: 'tableNumber' as OrderSortKey },
	{ label: 'Guests', sortBy: 'guestsCount' as OrderSortKey },
	{ label: 'Total', sortBy: 'totalAmount' as OrderSortKey, alignRight: true },
	{ label: 'Time', sortBy: 'orderTime' as OrderSortKey, alignRight: true },
];

const getSortLabel = (sortBy: OrderSortKey) => {
	return (
		orderSearchOptions.sortOptions.find((option) => option.value === sortBy)?.label ?? sortBy
	);
};

const isActiveSort = (
	currentSortBy: Partial<OrderSearchCriteria>['sortBy'],
	currentSortOrder: Partial<OrderSearchCriteria>['sortOrder'],
	sortBy: OrderSortKey,
) => (currentSortBy === sortBy ? currentSortOrder : undefined);

const OrderCell = ({ order, column }: { order: OrderListItem; column: OrderColumn }) => {
	switch (column.sortBy) {
		case 'id':
			return <span className='font-semibold'>Order #{order.id}</span>;
		case 'status':
			return (
				<span
					className={cn(
						'inline-flex rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap',
						getStatusColor(order.status),
					)}
				>
					{orderSearchOptions.statuses.find((option) => option.value === order.status)
						?.label || order.status}
				</span>
			);
		case 'tableNumber':
			return <span className='font-semibold'>{order.tableNumber}</span>;
		case 'guestsCount':
			return <span className='font-semibold'>{order.guestsCount}</span>;
		case 'totalAmount':
			return (
				<span className='text-ctp-green font-semibold'>
					{formatCurrency(order.totalAmount)}
				</span>
			);
		case 'orderTime':
			return <span className='text-ctp-subtext1 text-sm'>{formatDate(order.orderTime)}</span>;
		default:
			return null;
	}
};

export const OrderList = ({
	isLoading,
	orders,

	totalCount,
	isFetching,
	filters,
	onSortChange,
}: OrderListProps) => {
	const activeSortBy = filters?.sortBy;
	const activeSortOrder = filters?.sortOrder;

	return (
		<ViewTransition>
			<div className='space-y-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					{totalCount !== undefined && (
						<div className='text-ctp-subtext1 text-sm'>
							Found <span className='text-ctp-text font-bold'>{totalCount}</span>{' '}
							orders
						</div>
					)}

					{activeSortBy && (
						<div className='text-ctp-subtext1 text-xs'>
							Sorted by{' '}
							<span className='text-ctp-text font-medium'>
								{getSortLabel(activeSortBy)}
							</span>{' '}
							({activeSortOrder || 'asc'})
						</div>
					)}
				</div>

				<div className='space-y-3 md:hidden'>
					{isLoading && !orders ? (
						<div className='space-y-4'>
							{Array.from({ length: 4 }).map((_, index) => (
								<div
									key={index}
									className='bg-ctp-surface0 border-ctp-surface1 animate-pulse rounded-xl border p-4'
								>
									<div className='flex items-start justify-between gap-3'>
										<div className='space-y-2'>
											<div className='bg-ctp-surface1 h-5 w-28 rounded' />
											<div className='bg-ctp-surface1 h-4 w-20 rounded' />
										</div>
										<div className='bg-ctp-surface1 h-5 w-16 rounded' />
									</div>
									<div className='mt-4 grid grid-cols-2 gap-3'>
										<div className='bg-ctp-surface1 h-4 rounded' />
										<div className='bg-ctp-surface1 h-4 rounded' />
										<div className='bg-ctp-surface1 h-4 rounded' />
										<div className='bg-ctp-surface1 h-4 rounded' />
									</div>
								</div>
							))}
						</div>
					) : !orders || orders.length === 0 ? (
						<div className='text-ctp-subtext1 bg-ctp-surface0 border-ctp-surface1 rounded-xl border border-dashed px-4 py-8 text-center text-sm'>
							No orders found
						</div>
					) : (
						<div className='space-y-4'>
							{orders.map((order) => (
								<OrderCard key={order.id} order={order} />
							))}
						</div>
					)}
				</div>

				<div className='border-ctp-surface1 bg-ctp-surface0 hidden overflow-x-auto rounded-xl border md:block'>
					<div role='table' className='min-w-215'>
						<div
							role='row'
							className='bg-ctp-surface1/60 text-ctp-subtext0 grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_1fr_1fr] gap-3 border-b px-4 py-3 text-xs font-semibold tracking-wide uppercase'
						>
							{columns.map((column) => {
								const sortState = isActiveSort(
									activeSortBy,
									activeSortOrder,
									column.sortBy,
								);

								return (
									<button
										key={column.label}
										type='button'
										role='columnheader'
										aria-sort={
											sortState === 'asc'
												? 'ascending'
												: sortState === 'desc'
													? 'descending'
													: 'none'
										}
										className={cn(
											'hover:text-ctp-text flex items-center gap-2 text-left transition-colors',
											column.alignRight && 'justify-end text-right',
										)}
										onClick={() => onSortChange(column.sortBy)}
									>
										<span>{column.label}</span>
										<span className='text-ctp-subtext1 text-[10px] font-medium'>
											{sortState === 'asc'
												? '↑'
												: sortState === 'desc'
													? '↓'
													: '↕'}
										</span>
									</button>
								);
							})}
						</div>

						{isLoading && !orders ? (
							<div className='divide-ctp-surface1 animate-pulse divide-y'>
								{Array.from({ length: 6 }).map((_, index) => (
									<div
										key={index}
										className='grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_1fr_1fr] gap-3 px-4 py-4'
									>
										{Array.from({ length: columns.length }).map(
											(__, cellIndex) => (
												<div
													key={cellIndex}
													className={cn(
														'bg-ctp-surface1 h-4 rounded',
														cellIndex === columns.length - 1 &&
															'ml-auto w-24',
														cellIndex === columns.length - 2 &&
															'ml-auto w-20',
														cellIndex === 0 && 'w-36',
													)}
												/>
											),
										)}
									</div>
								))}
							</div>
						) : !orders || orders.length === 0 ? (
							<div className='text-ctp-subtext1 px-4 py-8 text-center text-sm'>
								No orders found
							</div>
						) : (
							<div className='divide-ctp-surface1 divide-y'>
								{orders.map((order) => (
									<div
										key={order.id}
										role='row'
										className={cn(
											'grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_1fr_1fr] gap-3 px-4 py-4 text-sm transition-colors',
											isFetching && 'opacity-80',
											'hover:bg-ctp-surface1/40',
										)}
									>
										{columns.map((column) => (
											<div
												key={column.label}
												role='cell'
												className={cn(column.alignRight && 'text-right')}
											>
												<OrderCell order={order} column={column} />
											</div>
										))}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</ViewTransition>
	);
};
