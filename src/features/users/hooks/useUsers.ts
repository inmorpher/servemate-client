'use client';

import { API_ENDPOINTS } from '@/consts';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import { UserListResult, UserParamSchema, UserSearchCriteria } from '@servemate/dto';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

export type UseUsersReturn = UseQueryResult<UserListResult> & {
	userSearchCriteria: UserSearchCriteria;
	updateSearchCriteria: (newCriteria: Partial<UserSearchCriteria>) => void;
};

/**
 * Custom React hook to fetch and manage a paginated, sortable list of users.
 *
 * This hook leverages React Query for data fetching and caching, and provides
 * state management for user search criteria, including pagination, sorting, and filtering.
 * It ensures that search criteria are validated before triggering a new fetch.
 *
 * @returns {UseUsersReturn} An object containing:
 * - All properties returned by React Query's `useQuery` (data, status, error, etc.)
 * - `userSearchCriteria`: The current validated search criteria used for fetching users.
 * - `updateSearchCriteria`: A function to update the search criteria. Accepts a partial
 *   `UserSearchCriteria` object, validates it, and triggers a refetch if valid.
 *
 * @remarks
 * - The hook initializes search criteria with sensible defaults (page 1, pageSize 10, sort by 'name' ascending).
 * - Search criteria are validated using `UserParamSchema` before being applied.
 * - Fetches user data from the API endpoint defined in `API_ENDPOINTS.Users`.
 * - Disables refetching on window focus and sets a stale time of 5 minutes for query caching.
 * - Logs an error and ignores updates if invalid search criteria are provided.
 *
 * @example
 * ```tsx
 * const {
 *   data,
 *   isLoading,
 *   userSearchCriteria,
 *   updateSearchCriteria,
 * } = useGetUsers();
 *
 * // To update page or sorting:
 * updateSearchCriteria({ page: 2, sortBy: 'email' });
 * ```
 */
export function useGetUsers(): UseUsersReturn {
	const userCriteria = useMemo(() => {
		const base = UserParamSchema.parse({});
		return {
			...base,
			page: base.page || 1,
			pageSize: base.pageSize || 10,
			sortBy: base.sortBy || 'name',
			sortOrder: base.sortOrder || 'asc',
		};
	}, []);

	// State to hold user search criteria
	const [userSearchCriteria, setUserSearchCriteria] = useState<UserSearchCriteria>(userCriteria);

	// React Query for data fetching
	const userData = useQuery({
		queryKey: ['userList', userSearchCriteria],
		queryFn: async (): Promise<UserListResult> => {
			// Construct URL parameters from validated criteria
			const queryString = buildQueryParams(userSearchCriteria);

			const response = await fetch(`${API_ENDPOINTS.Users}?${queryString}`);
			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}

			const result = await response.json();

			return result;
		},
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000,
	});

	// Function to update search criteria with validation to trigger re-fetching
	const updateSearchCriteria = useCallback((newCriteria: Partial<UserSearchCriteria>) => {
		setUserSearchCriteria((prevCriteria) => {
			const updatedCriteria = { ...prevCriteria, ...newCriteria };
			const result = UserParamSchema.safeParse(updatedCriteria);
			if (result.success) {
				return result.data;
			} else {
				console.error('Invalid search criteria:', result.error);
				return prevCriteria;
			}
		});
	}, []);

	// Smooth scroll to top when search criteria changes

	return {
		...userData,
		userSearchCriteria,
		updateSearchCriteria,
	};
}
