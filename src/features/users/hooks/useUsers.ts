import { useToaster } from '@/shared/components/toaster/ToasterProvider';
import { UserListResult, UserSearchCriteria } from '@servemate/dto';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export type UseUsersReturn = UseQueryResult<UserListResult> & {
	userSearchCriteria: UserSearchCriteria;
	setUserSearchCriteria: (criteria: UserSearchCriteria) => void;
	handleSearch: () => void;
	handlePageChange: (page: number) => void;
	handlePageSizeChange: (pageSize: number) => void;
};

export function useUsers(): UseUsersReturn {
	const { toast } = useToaster();

	const [userSearchCriteria, setUserSearchCriteria] = useState<UserSearchCriteria>({
		name: '',
		sortBy: 'name',
		sortOrder: 'asc',
		page: 1,
		pageSize: 10,
	});

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	const userData = useQuery({
		queryKey: ['userList', userSearchCriteria],
		queryFn: async (): Promise<UserListResult> => {
			const params = new URLSearchParams();

			Object.entries(userSearchCriteria).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					params.append(key, value.toString());
				}
			});

			const response = await fetch(`/api/service/users?${params.toString()}`);
			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}
			toast({
				type: 'success',
				message: 'User list loaded successfully',
			});
			const result = await response.json();
			return result;
		},
	});

	const handleSearch = () => {
		setUserSearchCriteria((prev) => ({ ...prev, page: 1 }));
	};

	const handlePageChange = (page: number) => {
		setUserSearchCriteria({ ...userSearchCriteria, page });
		scrollToTop();
	};

	const handlePageSizeChange = (pageSize: number) => {
		setUserSearchCriteria({ ...userSearchCriteria, pageSize, page: 1 });
		scrollToTop();
	};

	useEffect(() => {
		if (userData.isSuccess) {
			scrollToTop();
		}
	}, [userData.isSuccess, userSearchCriteria.page, userSearchCriteria.pageSize]);

	return {
		...userData,
		userSearchCriteria,
		setUserSearchCriteria,
		handleSearch,
		handlePageChange,
		handlePageSizeChange,
	};
}
