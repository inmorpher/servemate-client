import { API_ENDPOINTS } from '@/consts';
import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { OrderMetaDTO, OrderSearchListResult } from '@servemate/dto';

export const useGetOrdersAndMeta = () => {
	const { tabs } = useTabs();

	// console.log('Current Order Search Criteria:', orderSearchCriteria);
	/**
	 * Query result for fetching a list of orders using the current search criteria.
	 *
	 * This value is the object returned from useApiQuery<OrderSearchListResult> for
	 * API_ENDPOINTS.OrdersActions.list with the supplied orderSearchCriteria. It
	 * contains the fetched data (OrderSearchListResult | undefined) and the common
	 * query state and controls provided by the hook (for example: isLoading,
	 * isFetching, isError, error, data, refetch).
	 *
	 * Remarks:
	 * - The query will re-run automatically when orderSearchCriteria changes.
	 * - Caching, background refetching and other policies follow the behavior of
	 *   useApiQuery.
	 *
	 * Example:
	 * // if (ordersQuery.data) { const items = ordersQuery.data.items; }
	 *
	 * @see OrderSearchListResult
	 * @see useApiQuery
	 */
	const ordersQuery = useApiQuery<OrderSearchListResult>(API_ENDPOINTS.OrdersActions.list);

	/**
	 * Query result for fetching order metadata (OrderMetaDTO) from the OrdersActions.meta endpoint
	 * using the current order search criteria.
	 *
	 * The object returned by the hook includes the fetched data and standard query status helpers:
	 * - data: OrderMetaDTO | undefined — the metadata payload for the given search criteria (e.g., counts, aggregations, pagination info).
	 * - isLoading: boolean — true while the initial request is in progress.
	 * - isFetching: boolean — true while any background refetch is in progress.
	 * - isError: boolean — true if the request failed.
	 * - error: unknown — the error returned by the request, if any.
	 * - refetch: () => Promise<unknown> — manually trigger a refetch.
	 * - ...other helpers provided by the underlying useApiQuery implementation.
	 *
	 * Notes:
	 * - The query is tied to the provided search criteria and will re-run when the criteria change
	 *   (the criteria value is cast to OrderSearchCriteria).
	 * - Use `data` to drive UI state (counts, filters, pagination), `isLoading`/`isFetching` for loading indicators,
	 *   and `isError`/`error` plus `refetch` for error handling and retries.
	 *
	 * @see OrderMetaDTO
	 * @see OrderSearchCriteria
	 */
	const orderMetaQuery = useApiQuery<OrderMetaDTO>(API_ENDPOINTS.OrdersActions.meta, undefined, {
		staleTime: 5 * 60 * 1000,
	});

	return {
		orders: ordersQuery,
		ordersMeta: orderMetaQuery,
	};
};
