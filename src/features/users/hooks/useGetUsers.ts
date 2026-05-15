'use client';

import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import { UserListResult, UserSearchCriteria } from '@servemate/dto';
import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query';
import { usersApiClient } from '../api';

export type UseGetUsersReturn = UseQueryResult<UserListResult> & {
	userSearchCriteria: UserSearchCriteria;
};

export const useGetUsers = (
	userSearchCriteria: Partial<UserSearchCriteria> = {},
): UseGetUsersReturn => {
	const usersData = useQuery({
		queryKey: ['users', buildQueryParams(userSearchCriteria)],
		queryFn: () => usersApiClient.getUsers(userSearchCriteria as UserSearchCriteria),
		placeholderData: keepPreviousData,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});

	return {
		...usersData,
		userSearchCriteria: userSearchCriteria as UserSearchCriteria,
	};
};
