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

	return (
		<Card>
			<Card.ColorIndicator color={statusIndicatorColor} />
			<Card.Wrapper className='flex gap-6 xs:flex-col flex-row flex-wrap'>
				{/* Left block shows order ID, status, and timestamps */}
				<div className=' space-y-2'>
					<div className='flex items-center gap-3'>
						<Card.Text type='heading'>Order #{order.id}</Card.Text>
						<Card.Text className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
							{order.status}
						</Card.Text>
					</div>

					<Card.Text type='text'>Server: {order.server.name}</Card.Text>

					<div className='space-y-1 text-ctp-subtext1 text-xs'>
						<Card.Text className='block'>Ordered: {formattedOrderTime}</Card.Text>
						<Card.Text className='sm:block'>Updated: {formattedUpdatedAt}</Card.Text>
						{formattedCompletionTime && <Card.Text>Completed: {formattedCompletionTime}</Card.Text>}
					</div>
				</div>

				{/* Right block shows guests, table, pricing, allergies */}
				<div className=' space-y-2'>
					<div className='flex items-center gap-4'>
						<Card.Text className='text-xs font-medium text-ctp-subtext1'>
							Table {order.tableNumber}
						</Card.Text>
						<Card.Text className='text-xs font-medium text-ctp-subtext1'>
							{order.guestsCount} guests
						</Card.Text>
					</div>

					<div className='flex items-center gap-4'>
						<Card.Text className='font-medium text-ctp-green'>
							Total: {formatCurrency(order.totalAmount)}
						</Card.Text>
					</div>

					{order.discount > 0 && (
						<Card.Text className='text-ctp-peach block'>
							Discount: {formatCurrency(order.discount)}
						</Card.Text>
					)}
					{order.tip > 0 && (
						<Card.Text className='text-ctp-blue block'>Tip: {formatCurrency(order.tip)}</Card.Text>
					)}
					{(order.allergies || order.comments) && (
						<div>
							{order.allergies && order.allergies.length > 0 && (
								<Card.Text className='text-ctp-red text-sm block'>
									⚠️ Allergies: {order.allergies.join(', ')}
								</Card.Text>
							)}
							{order.comments && (
								<Card.Text className='text-ctp-subtext1 text-sm'>
									💬 Comments: {order.comments}
								</Card.Text>
							)}
						</div>
					)}
				</div>
			</Card.Wrapper>
		</Card>
	);
});

export { OrderCard };
