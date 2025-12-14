import { OrdersListPage } from '@/features/orders/ui/OrdersListPage';

export const metadata = {
	title: 'Orders',
	description: 'Orders management page',
};

export default async function OrdersPage() {
	const oredersMeta = await fetch('http://192.168.2.71:3002/api/orders/meta');
	const response = await oredersMeta.json();

	return <div className='relative h-full rounded-2xl'>{<OrdersListPage meta={response} />}</div>;
}
