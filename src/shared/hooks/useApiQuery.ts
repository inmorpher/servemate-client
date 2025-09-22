import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { buildApiUrl } from '../utils/buildApiUrl';

export const useApiQuery = <TData = unknown>(
	endpoint: string,
	params?: Record<string, unknown>,
	options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: [endpoint, params],
		queryFn: async () => {
			const url = buildApiUrl(endpoint, params);
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			return response.json() as Promise<TData>;
		},
		placeholderData: keepPreviousData,
		...options, //other options like staleTime, refetchOnWindowFocus etc.
	});
};
