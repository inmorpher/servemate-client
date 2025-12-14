import { OrdersListPage } from '@/features/orders/ui/OrdersListPage';
import { OrderSearchCriteria } from '@servemate/dto';

export const metadata = {
	title: 'Orders',
	description: 'Orders management page',
};

export default async function OrdersPage({ searchParams }: { searchParams: OrderSearchCriteria }) {
	console.log('Search params:', await searchParams);

	return <div className='relative h-full rounded-2xl'>{<OrdersListPage />}</div>;
}

///nenen rfrfsfjksdjflksdjflksjdklfsdf
