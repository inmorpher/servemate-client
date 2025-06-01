'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

interface QueryProviderProps {
	children: ReactNode;
}
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 1,
			gcTime: 1000 * 60 * 5,
			retry: 3,
			retryDelay: (attendIndex) => Math.min(1000 * 2 ** attendIndex, 30000), // Exponential backoff with a max delay of 30 seconds
		},
	},
});

export const QueryProvider = ({ children }: QueryProviderProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};
