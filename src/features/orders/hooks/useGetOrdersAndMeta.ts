import { API_ENDPOINTS } from '@/consts';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { useResourceSearchCriteria } from '@/shared/hooks/useResourceSearchCriteria';
import {
	OrderMetaDTO,
	OrderSearchCriteria,
	OrderSearchListResult,
	OrderSearchSchema,
} from '@servemate/dto';

export const useGetOrdersAndMeta = () => {
	/**
	 * Manages search criteria, pagination and filter updates for orders.
	 *
	 * Returns an object with the following properties:
	 * - searchCriteria: OrderSearchCriteria
	 *   The current, validated search criteria used to query the orders resource.
	 *
	 * - updateSearchCriteria(changes: Partial<OrderSearchCriteria>): void
	 *   Merge-updates arbitrary fields on the search criteria. Provided values will
	 *   be validated/normalized against the configured schema.
	 *
	 * - setPage(page: number): void
	 *   Set the current page number used for paginated requests.
	 *
	 * - setPageSize(size: number): void
	 *   Set the number of items per page used for paginated requests.
	 *
	 * - updateFilters(filterChanges: Partial<OrderSearchCriteria>): void
	 *   Update filter fields specifically. Because resetPageOnFilters is enabled,
	 *   calling this will also reset pagination to the first page to ensure results
	 *   reflect the new filter set.
	 *
	 * Configuration details (used by the underlying hook):
	 * - schema: OrderSearchSchema — validation/normalization schema for the criteria.
	 * - numberFields: ['id', 'page', 'pageSize', 'guestsCount', 'minAmount', 'maxAmount']
	 *   Fields that will be coerced/treated as numbers.
	 * - arrayFields: ['status']
	 *   Fields that will be coerced/treated as arrays.
	 * - resetPageOnFilters: true
	 *   Automatically reset pagination when filters are updated.
	 *
	 * Notes:
	 * - Updater functions generally accept partial criteria objects and perform
	 *   schema-aware coercion of numeric/array fields.
	 * - Prefer updateFilters when changing filter-related fields to guarantee a
	 *   pagination reset and consistent UX.
	 */
	const {
		searchCriteria: orderSearchCriteria,
		setPage,
		setPageSize,
		updateFilters,
		updateSearchCriteria,
	} = useResourceSearchCriteria<OrderSearchCriteria>({
		schema: OrderSearchSchema,
		numberFields: ['id', 'page', 'pageSize', 'guestsCount', 'minAmount', 'maxAmount'],
		arrayFields: ['statuses', 'allergies'],
		resetPageOnFilters: true,
	});

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
	const ordersQuery = useApiQuery<OrderSearchListResult>(
		API_ENDPOINTS.OrdersActions.list,
		orderSearchCriteria as OrderSearchCriteria
	);

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
	const orderMetaQuery = useApiQuery<OrderMetaDTO>(
		API_ENDPOINTS.OrdersActions.meta,
		orderSearchCriteria as OrderSearchCriteria
	);

	return {
		orders: ordersQuery,
		ordersMeta: orderMetaQuery,
		updateSearchCriteria,
		setPage,
		setPageSize,
		updateFilters,
	};
};
