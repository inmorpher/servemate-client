import { Card } from '@/features/card';
import { OrderSearchListResult } from '@servemate/dto';
import { memo } from 'react';
import {
	formatCurrency,
	formatDate,
	getStatusColor,
	getStatusIndicatorColor,
} from '../utils/orderHelpers';

type OrderListItem = OrderSearchListResult['orders'][number];

/**
 * Displays an order card with order details such as ID, status, server, table, and financial information.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {OrderListItem} props.order - The order data to display in the card.
 * @returns {JSX.Element} The rendered order card component.
 *
 * @remarks
 * - Shows the order ID, status (with color indicator), server name, and table number.
 * - Displays financial information like total amount, discount, and tip.
 * - Shows order timestamps and guest count.
 * - Uses memoization to prevent unnecessary re-renders.
 */
const OrderCard = memo(function OrderCard({ order }: { order: OrderListItem }) {
	const statusColor = getStatusColor(order.status);
	const statusIndicatorColor = getStatusIndicatorColor(order.status);
	const formattedOrderTime = formatDate(order.orderTime);
	const formattedUpdatedAt = formatDate(order.updatedAt);
	const formattedCompletionTime = order.completionTime ? formatDate(order.completionTime) : null;
	console.log('order allergies', order.allergies);
	return (
		<Card>
			<Card.Wrapper>
				<Card.ColorIndicator color={statusIndicatorColor} />
				<div className='flex items-center gap-3 mb-2'>
					<Card.Text type='heading'>Order #{order.id}</Card.Text>
					<Card.Text className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
						{order.status}
					</Card.Text>
					<Card.Text className='text-xs font-medium text-ctp-subtext1'>
						Table {order.tableNumber}
					</Card.Text>
					<Card.Text className='text-xs font-medium text-ctp-subtext1'>
						{order.guestsCount} guests
					</Card.Text>
				</div>

				<div className='mb-2'>
					<Card.Text type='text'>Server: {order.server.name}</Card.Text>
				</div>

				<div className='flex items-center gap-4 mb-2'>
					<Card.Text className='font-medium text-ctp-green'>
						Total: {formatCurrency(order.totalAmount)}
					</Card.Text>
					{order.discount > 0 && (
						<Card.Text className='text-ctp-peach'>
							Discount: {formatCurrency(order.discount)}
						</Card.Text>
					)}
					{order.tip > 0 && (
						<Card.Text className='text-ctp-blue'>Tip: {formatCurrency(order.tip)}</Card.Text>
					)}
				</div>

				{(order.allergies || order.comments) && (
					<div className='mb-2 space-y-1'>
						{order.allergies && order.allergies.length > 0 && (
							<Card.Text className='text-ctp-red text-sm block'>
								⚠️ Allergies: {order.allergies}
							</Card.Text>
						)}
						{order.comments && (
							<Card.Text className='text-ctp-subtext1 text-sm'>
								💬 Comments: {order.comments}
							</Card.Text>
						)}
					</div>
				)}

				<div className='flex flex-wrap gap-4 text-ctp-subtext1 text-xs'>
					<Card.Text>Ordered: {formattedOrderTime}</Card.Text>
					<Card.Text>Updated: {formattedUpdatedAt}</Card.Text>
					{formattedCompletionTime && <Card.Text>Completed: {formattedCompletionTime}</Card.Text>}
				</div>
			</Card.Wrapper>
		</Card>
	);
});

export { OrderCard };
