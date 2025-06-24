'use client';

import { API_ENDPOINTS } from '@/consts';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import { OrderSearchCriteria, OrderSearchListResult, OrderSearchSchema } from '@servemate/dto';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

type UseGetOrdersReturn = UseQueryResult<OrderSearchListResult> & {
	orderSearchCriteria: OrderSearchCriteria;
	updateSearchCriteria: (newCriteria: Partial<OrderSearchCriteria>) => void;
};

export const useGetOrders = (): UseGetOrdersReturn => {
	const ordersCriteria = useMemo(() => {
		const base = OrderSearchSchema.parse({});
		return {
			...base,
			page: base.page || 1,
			pageSize: base.pageSize || 10,
			sortBy: base.sortBy || 'createdAt',
			sortOrder: base.sortOrder || 'desc',
		};
	}, []);

	const [orderSearchCriteria, setOrderSearchCriteria] =
		useState<OrderSearchCriteria>(ordersCriteria);

	const ordersData = useQuery({
		queryKey: ['orders', orderSearchCriteria],
		queryFn: async () => {
			const queryParams = buildQueryParams(orderSearchCriteria);
			const response = await fetch(`${API_ENDPOINTS.Orders}?${queryParams.toString()}`);
			if (!response.ok) {
				throw new Error('Failed to fetch orders');
			}
			return await response.json();
		},

		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: false,
	});

	const updateSearchCriteria = useCallback((newCriteria: Partial<OrderSearchCriteria>) => {
		setOrderSearchCriteria((prevCriteria) => {
			const updatedCriteria = { ...prevCriteria, ...newCriteria };
			const result = OrderSearchSchema.safeParse(updatedCriteria);
			if (result.success) {
				return result.data;
			} else {
				console.error('Invalid search criteria:', result.error);
				return prevCriteria;
			}
		});
	}, []);

	return {
		...ordersData,
		orderSearchCriteria,
		updateSearchCriteria,
	};
};
