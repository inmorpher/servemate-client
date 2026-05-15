'use client';

import { UserListResult } from '@servemate/dto';

import { HoverCardComponent } from '@/shared/components/hover-card';
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
			<HoverCardComponent side='left'>
				<HoverCardComponent.Trigger asChild>
					<button>Hover me</button>
				</HoverCardComponent.Trigger>
				<HoverCardComponent.Content>
					<div className='p-4'>This is the hover card content</div>
				</HoverCardComponent.Content>
			</HoverCardComponent>

			{users.map((user) => (
				<UserCard key={user.id} user={user} />
			))}
		</div>
	);
}
