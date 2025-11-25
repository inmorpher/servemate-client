import { OrdersListPage } from '@/features/orders/ui/OrdersListPage';

export const metadata = {
	title: 'Orders',
	description: 'Orders management page',
};

export default async function OrdersPage() {
	return <div className='relative rounded-2xl h-full bg-ctp-base'>{<OrdersListPage />}</div>;
}
