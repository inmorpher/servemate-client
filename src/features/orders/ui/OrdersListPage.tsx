'use client';

import Pagination from '@/shared/components/pagination/Paginations';
import { ListError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayout';
import { OrderMetaDTO } from '@servemate/dto';
import { useGetOrdersAndMeta } from '../hooks/useGetOrdersAndMeta';
import { OrderFilters } from './OrderFilters';
import { OrderList } from './OrderList';

export const OrdersListPage = ({ meta }: { meta: OrderMetaDTO }) => {
	const { orders, ordersMeta, orderSearchCriteria, setPage, setPageSize, updateFilters } =
		useGetOrdersAndMeta();

	const { totalCount, pageSize, page, totalPages } = orders.data || {};

	return (
		<ListPageLayout
			renderFooter={() => (
				<Pagination
					totalCount={totalCount ?? 0}
					totalPages={totalPages ?? 1}
					currentPage={page ?? 1}
					pageSize={pageSize ?? 10}
					onPageChange={setPage}
					onPageSizeChange={setPageSize}
				/>
			)}
			renderFilters={() => (
				<OrderFilters
					ordersMeta={ordersMeta}
					orderSearchCriteria={orderSearchCriteria}
					updateFilters={updateFilters}
				/>
			)}
			renderContent={() =>
				orders.isError ? (
					<ListError
						error={orders.error?.message}
						refetch={orders.refetch}
						isLoading={orders.isLoading}
					/>
				) : (
					<OrderList
						isFetching={orders.isFetching}
						isLoading={orders.isLoading}
						orders={orders.data?.orders}
						pageSize={pageSize ?? 10}
					/>
				)
			}
		></ListPageLayout>
	);
};
