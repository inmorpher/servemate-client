import { OrderFilters } from '@/features/orders/ui/OrderFilters';
import { OrderList } from '@/features/orders/ui/OrderList';
import Pagination from '@/shared/components/pagination/Paginations';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { buildApiUrl } from '@/shared/utils/buildApiUrl';
import { fetchWithAuth } from '@/shared/utils/fecthWithAuth';
import { OrderSearchCriteria, OrderSearchSchema } from '@servemate/dto';

export const metadata = {
	title: 'Orders',
	description: 'Orders management page',
};

export default async function OrdersPage({ searchParams }: { searchParams: OrderSearchCriteria }) {
	console.log('Search params:', await searchParams);
	const query = await searchParams;

	const parsedQuery = OrderSearchSchema.safeParse(query);
	console.log('Parsed query:', parsedQuery);
	const url = buildApiUrl('/orders', parsedQuery.data);

	const ordersData = await fetchWithAuth(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const ordersMeta = await fetchWithAuth('http://192.168.2.80:3002/api/orders/meta', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	console.log('Orders Data:', ordersData);

	return (
		<div className='relative h-full rounded-2xl'>
			<ListPageLayout
				renderFooter={() => (
					<Pagination
						totalCount={ordersData?.totalCount ?? 0}
						totalPages={ordersData?.totalPages ?? 1}
						currentPage={ordersData?.page ?? 1}
						pageSize={ordersData?.pageSize ?? 10}
					/>
				)}
				renderFilters={() => <OrderFilters ordersMeta={ordersMeta} />}
				renderContent={() =>
					!ordersData ? (
						<ListError error={'smthg wrong'} isLoading={false} />
					) : (
						<OrderList
							isFetching={false}
							isLoading={false}
							orders={ordersData.orders}
							pageSize={ordersData?.pageSize ?? 10}
						/>
					)
				}
			></ListPageLayout>
		</div>
	);
}

///nenen rfrfsfjksdjflksdjflksjdklfsdf
