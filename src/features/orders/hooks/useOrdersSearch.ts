import { API_ENDPOINTS } from '@/consts';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { useSearchCriteria } from '@/shared/hooks/useSearchCriteria';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import {
	OrderMetaDTO,
	OrderSearchCriteria,
	OrderSearchListResult,
	OrderSearchSchema,
} from '@servemate/dto';
import { usePathname, useRouter } from 'next/navigation';

import { useCallback } from 'react';

export const useOrdersSearch = () => {
	const router = useRouter();
	const pathname = usePathname();

	const orderSearchCriteria = useSearchCriteria({
		schema: OrderSearchSchema,
		numberFields: ['id', 'page', 'pageSize', 'guestsCount', 'minAmount', 'maxAmount'],
		arrayFields: ['status'],
	});

	// Fetch orders
	// const ordersQuery: UseQueryResult<OrderDTO> = useQuery({
	// 	queryKey: ['orders', orderSearchCriteria],
	// 	queryFn: async () => {
	// 		const url = buildApiUrl(API_ENDPOINTS.OrdersActions.list, orderSearchCriteria);
	// 		const response = await fetch(url);
	// 		if (!response.ok) {
	// 			throw new Error('Failed to fetch orders');
	// 		}
	// 		return response.json();
	// 	},
	// });

	const ordersQuery = useApiQuery<OrderSearchListResult>(
		API_ENDPOINTS.OrdersActions.list,
		orderSearchCriteria
	);
	// Fetch orders meta
	// const ordersMetaQuery = useQuery({
	// 	queryKey: ['ordersMeta', orderSearchCriteria],
	// 	queryFn: () => orderApiClient.getMeta(orderSearchCriteria),
	// 	placeholderData: keepPreviousData,
	// 	notifyOnChangeProps: ['data', 'error', 'isLoading', 'isFetching'],
	// 	staleTime: 5 * 60 * 1000, // 5 minutes
	// 	refetchOnWindowFocus: true,
	// });

	const ordersMetaQuery = useApiQuery<OrderMetaDTO>(
		API_ENDPOINTS.OrdersActions.meta,
		orderSearchCriteria
	);

	const updateSearchCriteria = useCallback(
		(newCriteria: Partial<OrderSearchCriteria>) => {
			const updatedCriteria = { ...orderSearchCriteria, ...newCriteria };
			const queryParams = buildQueryParams(updatedCriteria);
			router.push(`${pathname}?${queryParams.toString()}`);
		},
		[orderSearchCriteria, router, pathname]
	);
	return {
		orderSearchCriteria,
		updateSearchCriteria,
		ordersData: ordersQuery.data,
		ordersMetaQuery: ordersMetaQuery.data,
		isLoading: ordersQuery.isLoading || ordersMetaQuery.isLoading,
		isFetching: ordersQuery.isFetching || ordersMetaQuery.isFetching,
		error: ordersQuery.error || ordersMetaQuery.error,
		isError: ordersQuery.error || ordersMetaQuery.error,
		isSuccess: ordersQuery.isSuccess && ordersMetaQuery.isSuccess,
		refetch: ordersMetaQuery.refetch,
	};
};
