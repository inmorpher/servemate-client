'use client';

import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { Button } from '@/shared/components/button';
import { Table } from '@/shared/components/table';
import { OrderSearchCriteria, OrderSearchListResult, OrderSortOptions } from '@servemate/dto';
import { CircleDot, Pencil } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '../utils/orderHelpers';
interface OrderListTestProps {
	orders: OrderSearchListResult['orders'] | undefined;
	isLoading?: boolean;
	sortBy?: Partial<OrderSearchCriteria['sortBy']>;
	sortOrder?: Partial<OrderSearchCriteria['sortOrder']>;
	onSortChange: (sortBy: NonNullable<OrderSearchCriteria['sortBy']>) => void;
}

type OrderRow = {
	id: number;
	status: string;
	tableNumber: number;
	guestsCount: number;
	totalAmount: string;
	orderTime: string;
};

const columns = [
	{ label: 'Order', sortBy: OrderSortOptions.ID },
	{ label: 'Status', sortBy: OrderSortOptions.STATUS },
	{ label: 'Table', sortBy: OrderSortOptions.TABLE_NUMBER },
	{ label: 'Guests', sortBy: OrderSortOptions.GUESTS_NUMBER },
	{ label: 'Total', sortBy: OrderSortOptions.TOTAL_AMOUNT },
	{ label: 'Time', sortBy: OrderSortOptions.ORDER_TIME },
] as const satisfies ReadonlyArray<{
	label: string;
	sortBy: NonNullable<OrderSearchCriteria['sortBy']>;
}>;

export const OrderListTest = ({
	orders,
	isLoading,
	onSortChange,
	sortBy,
	sortOrder,
}: OrderListTestProps) => {
	const isActiveColumn = (columnSortBy: NonNullable<OrderSearchCriteria['sortBy']>) => {
		return sortBy === columnSortBy;
	};
	return (
		<div className='border-ctp-surface1 bg-ctp-surface0 min-w-50 overflow-x-auto rounded-xl border'>
			<Table className='text-ctp-text w-full table-fixed'>
				<Table.Head>
					<Table.Row className='bg-ctp-surface1/60 text-ctp-subtext0 divide-amber-50 p-0'>
						{columns.map((column) => {
							const isActiveSort = isActiveColumn(column.sortBy);
							console.table({ sortBy, columnSortBy: column.sortBy });
							console.log('isActiveSort', isActiveSort);
							return (
								<Table.HeaderCell
									key={column.label}
									isSortable
									isSorted={isActiveSort ? (sortOrder ?? undefined) : undefined}
									data-active={isActiveSort}
									onClick={() => onSortChange(column.sortBy)}
									className='group/column'
								>
									<Button
										variant='ghost'
										size='bare'
										className='h-10 w-full px-0 py-0'
									>
										{column.label}
									</Button>
								</Table.HeaderCell>
							);
						})}
						<Table.HeaderCell className='w-15' key={'column-actions'}>
							<span className='sr-only'>actions</span>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Head>

				{isLoading ? (
					<Table.Skeleton rows={10} columns={columns.length} />
				) : (
					<Table.Body>
						{orders?.map((order) => (
							<Table.Row key={order.id}>
								<Table.Cell data-active={isActiveColumn(OrderSortOptions.ID)}>
									Order #{order.id}
								</Table.Cell>

								<Table.Cell
									className={getStatusColor(order.status)}
									data-active={isActiveColumn(OrderSortOptions.STATUS)}
								>
									{order.status}
								</Table.Cell>
								<Table.Cell
									data-active={isActiveColumn(OrderSortOptions.TABLE_NUMBER)}
								>
									{order.tableNumber}
								</Table.Cell>
								<Table.Cell
									data-active={isActiveColumn(OrderSortOptions.GUESTS_NUMBER)}
								>
									{order.guestsCount}
								</Table.Cell>
								<Table.Cell
									className='text-ctp-green font-semibold'
									data-active={isActiveColumn(OrderSortOptions.TOTAL_AMOUNT)}
								>
									{formatCurrency(order.totalAmount)}
								</Table.Cell>
								<Table.Cell
									className='text-monospace text-ctp-subtext0'
									align='justify'
									data-active={isActiveColumn(OrderSortOptions.ORDER_TIME)}
								>
									{formatDate(order.orderTime)}
								</Table.Cell>
								<Table.Cell>
									<ActionMenu
										orientation='horizontal'
										items={[
											{
												label: `Edit order`,
												icon: <Pencil size={16} />,
												onClick: () => {
													// Handle edit action
												},
												variant: 'default',
											},
											{
												label: `Change status`,
												icon: <CircleDot className='h-4 w-4' />,
												onClick: () => {
													// Handle change status action
												},
											},
											{
												label: `Delete order`,
												icon: <CircleDot className='h-4 w-4' />,
												onClick: () => {
													// Handle delete action
												},
												variant: 'destructive',
											},
										]}
										ariaLabel={`Actions for order #${order.id}`}
									/>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				)}
			</Table>
		</div>
	);
};
