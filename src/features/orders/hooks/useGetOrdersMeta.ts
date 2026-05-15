'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { orderApiClient } from '../api';

export const useGetOrdersMeta = () => {
	return useQuery({
		queryKey: ['orders', 'meta'],
		queryFn: () => orderApiClient.getMeta(),
		placeholderData: keepPreviousData,
		staleTime: 5 * 60 * 1000,
		refetchInterval: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});
};