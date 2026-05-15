'use client';

import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import { OrderSearchCriteria } from '@servemate/dto';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { orderApiClient } from '../api';
import { useGetOrdersMeta } from './useGetOrdersMeta';

export const useGetOrdersAndMeta = (orderSearchCriteria: Partial<OrderSearchCriteria> = {}) => {
	const queryParams = buildQueryParams(orderSearchCriteria);
	const ordersQuery = useQuery({
		queryKey: ['orders', queryParams],
		queryFn: () => orderApiClient.getOrders(orderSearchCriteria as OrderSearchCriteria),
		placeholderData: keepPreviousData,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});
	const orderMetaQuery = useGetOrdersMeta();

	return {
		orders: ordersQuery,
		ordersMeta: orderMetaQuery,
	};
};
