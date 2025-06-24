import { OrdersListPage } from '@/features/orders/ui/OrdersListPage';
import { Suspense } from 'react';

export const metadata = {
	title: 'Orders',
	description: 'Orders management page',
};

export default function OrdersPage() {
	return (
		<div className='relative  bg-ctp-surface0 rounded-2xl h-full'>
			<Suspense fallback={<div className='p-4'>Loading...</div>}>
				<OrdersListPage />
			</Suspense>
		</div>
	);
}
