'use client';

import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import { OrderSearchCriteria, OrderSearchListResult, OrderSearchSchema } from '@servemate/dto';
import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { orderApiClient } from '../api';

type UseGetOrdersReturn = UseQueryResult<OrderSearchListResult> & {
	orderSearchCriteria: OrderSearchCriteria;
	updateSearchCriteria: (newCriteria: Partial<OrderSearchCriteria>) => void;
};

export const useGetOrders = (): UseGetOrdersReturn => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const orderSearchCriteria = useMemo(() => {
		const params = Object.fromEntries(searchParams.entries());
		const queryToParse = {
			...params,
			page: params.page ? Number(params.page) : undefined,
			pageSize: params.pageSize ? Number(params.pageSize) : undefined,
			id: params.id ? Number(params.id) : undefined,
		};

		const parsedResult = OrderSearchSchema.safeParse(queryToParse);
		return parsedResult.success ? parsedResult.data : OrderSearchSchema.parse({});
	}, [searchParams]);

	const ordersData = useQuery({
		queryKey: ['orders', orderSearchCriteria],
		queryFn: () => orderApiClient.getOrders(orderSearchCriteria),
		placeholderData: keepPreviousData,
		notifyOnChangeProps: ['data', 'error', 'isLoading', 'isFetching'],
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: false,
	});

	const updateSearchCriteria = useCallback(
		(newCriteria: Partial<OrderSearchCriteria>) => {
			const updatedCriteria = { ...orderSearchCriteria, ...newCriteria };
			const queryParams = buildQueryParams(updatedCriteria);
			router.push(`${pathname}?${queryParams.toString()}`);
		},
		[orderSearchCriteria, router, pathname],
	);

	return {
		...ordersData,
		orderSearchCriteria,
		updateSearchCriteria,
	};
};
