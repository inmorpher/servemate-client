'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApiClient } from '../api';

export const useGetUsersMeta = () =>
	useQuery({
		queryKey: ['users', 'meta'],
		queryFn: usersApiClient.getMeta,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});
