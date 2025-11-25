'use client';

import { UserListResult } from '@servemate/dto';

import { ListSkeleton } from '@/shared/components/skeleton/ListSkeleton';
import UserCard from './UserCard';

interface UserListProps {
	isLoading?: boolean;
	users: UserListResult['users'] | undefined;
	pageSize: number;
}

export function UserList({ isLoading, users, pageSize }: UserListProps) {
	if (isLoading) {
		return <ListSkeleton count={pageSize} />;
	}
	if (!users || users.length === 0) {
		return <div className='text-center text-gray-500'>No users found</div>;
	}

	return (
		<div className='space-y-4' style={{ minHeight: 'inherit' }}>
			{users.map((user) => (
				<UserCard key={user.id} user={user} />
			))}
		</div>
	);
}
