import { UserListResult, UserParamSchema } from '@servemate/dto';
import { z } from 'zod';
import { apiAction } from '../testWrapper';

export async function getUsers(criteria: z.infer<typeof UserParamSchema>): Promise<UserListResult> {
	const queryParams = new URLSearchParams();

	Object.entries(criteria).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			queryParams.append(key, value.toString());
		}
	});

	const queryString = queryParams.toString();
	const endpoint = queryString ? `/users?${queryString}` : '/users';

	return await apiAction<UserListResult>({
		method: 'GET',
		endpoint,
		requiresAuth: true,
	});
}
