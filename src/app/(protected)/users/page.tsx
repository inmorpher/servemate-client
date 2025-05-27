import { getUsers } from '@/shared/api/users/users.api';
import { TestList } from './testList';

export default async function UsersPage() {
	// const response = await apiAction<UserListResult>({
	// 	method: 'GET',
	// 	endpoint: '/users',
	// 	requiresAuth: true,
	// });

	const response = await getUsers({
		page: 2,
	});

	return (
		<div className='text-white'>
			<h1>{response.users[0].name}</h1>
			<p>This is the users page.</p>
			<TestList initialUsers={response} />
		</div>
	);
}
