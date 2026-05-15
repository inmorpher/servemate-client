'use client';

import { userSearchOptions } from '@/features/search';
import { ActionMenu } from '@/shared/components/action-menu/ActionMenu';
import { Button } from '@/shared/components/button';
import { Table } from '@/shared/components/table';
import { UserListItem, UserListResult, UserSearchCriteria, UserSortColumn } from '@servemate/dto';
import { Pencil, Trash2 } from 'lucide-react';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { formatDate, getRoleColor } from '../utils/userHelpers';

export type UsersListItem = UserListResult['users'][number];

type UserSortKey = NonNullable<UserSearchCriteria['sortBy']>;

const columns: Array<{ label: string; sortBy?: UserSortKey; alignRight?: boolean }> = [
	{ label: 'Name', sortBy: UserSortColumn.NAME },
	{ label: 'Email', sortBy: UserSortColumn.EMAIL },
	{ label: 'Role', sortBy: UserSortColumn.ROLE },
	{ label: 'Status' },
	{ label: 'Created', sortBy: UserSortColumn.CREATED_AT, alignRight: true },
	{ label: 'Updated', sortBy: UserSortColumn.UPDATED_AT, alignRight: true },
];

const getSortLabel = (sortBy: UserSortKey) => {
	return userSearchOptions.sortOptions.find((option) => option.value === sortBy)?.label ?? sortBy;
};

export interface UsersListProps {
	isLoading?: boolean;
	users: UsersListItem[] | undefined;
	pageSize: number;
	totalCount?: number;
	sortBy?: UserSearchCriteria['sortBy'];
	sortOrder?: UserSearchCriteria['sortOrder'];
	onSortChange: (sortBy: UserSortKey) => void;
	onEditUser?: (user: UserListItem) => void;
}

export const UsersList = ({
	isLoading,
	users,
	pageSize,
	totalCount,
	sortBy,
	sortOrder,
	onSortChange,
	onEditUser,
}: UsersListProps) => {
	const deleteUserMutation = useDeleteUser();
	const activeSortBy = sortBy;
	const activeSortOrder = sortOrder;

	const isActiveSort = (columnSortBy?: UserSortKey) =>
		columnSortBy !== undefined && activeSortBy === columnSortBy;

	const handleDeleteUser = async (userId: number) => {
		const shouldDelete = globalThis.confirm(`Delete user #${userId}?`);
		if (!shouldDelete) {
			return;
		}

		await deleteUserMutation.mutateAsync({ id: String(userId) });
	};

	if (isLoading) {
		return (
			<div className='space-y-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<div className='text-ctp-subtext1 text-sm'>
						Loading <span className='text-ctp-text font-bold'>users</span>
					</div>
					{activeSortBy && (
						<div className='text-ctp-subtext1 text-xs'>
							Sorted by{' '}
							<span className='text-ctp-text font-medium'>
								{getSortLabel(activeSortBy)}
							</span>{' '}
							({activeSortOrder || 'asc'})
						</div>
					)}
				</div>
				<div className='border-ctp-surface1 bg-ctp-surface0 min-w-50 overflow-x-auto rounded-xl border'>
					<Table className='w-full table-fixed'>
						<Table.Skeleton rows={pageSize} columns={columns.length + 1} />
					</Table>
				</div>
			</div>
		);
	}

	if (!users || users.length === 0) {
		return (
			<div className='border-ctp-surface1 bg-ctp-surface0 text-ctp-subtext1 rounded-xl border px-6 py-10 text-center text-sm'>
				No users found
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				{totalCount !== undefined && (
					<div className='text-ctp-subtext1 text-sm'>
						Found <span className='text-ctp-text font-bold'>{totalCount}</span> users
					</div>
				)}
				{activeSortBy && (
					<div className='text-ctp-subtext1 text-xs'>
						Sorted by
						<span className='text-ctp-text font-medium'>
							{getSortLabel(activeSortBy)}
						</span>
						({activeSortOrder || 'asc'})
					</div>
				)}
			</div>

			<div className='border-ctp-surface1 bg-ctp-surface0 min-w-50 overflow-x-auto rounded-xl border'>
				<Table className='w-full table-fixed'>
					<Table.Head>
						<Table.Row className='bg-ctp-surface1/60 text-ctp-subtext0'>
							{columns.map((column) => {
								const sortState =
									column.sortBy && isActiveSort(column.sortBy)
										? activeSortOrder
										: undefined;

								return (
									<Table.HeaderCell
										key={column.label}
										isSortable={Boolean(column.sortBy)}
										isSorted={sortState}
										alignRight={column.alignRight}
										onClick={() => {
											if (column.sortBy) {
												onSortChange(column.sortBy);
											}
										}}
										className='group/column'
									>
										<Button
											variant='ghost'
											size='bare'
											className='h-10 w-full px-0 py-0'
										>
											{column.label}
										</Button>
									</Table.HeaderCell>
								);
							})}
							<Table.HeaderCell className='w-15'>
								<span className='sr-only'>Actions</span>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Head>

					<Table.Body>
						{users.map((user) => {
							const roleColor = getRoleColor(user.role);
							const formattedCreatedAt = formatDate(user.createdAt);
							const formattedUpdatedAt = formatDate(user.updatedAt);
							const formattedLastLogin = user.lastLogin
								? formatDate(user.lastLogin)
								: '—';

							return (
								<Table.Row key={user.id}>
									<Table.Cell className='font-medium'>{user.id}</Table.Cell>
									<Table.Cell className='font-medium'>
										<div className='flex flex-col gap-1'>
											<span>{user.name}</span>
											<span className='text-ctp-subtext1 text-xs'>
												#{user.id}
											</span>
										</div>
									</Table.Cell>
									<Table.Cell>{user.email.toLowerCase()}</Table.Cell>
									<Table.Cell>
										<span
											className={`rounded-full px-2 py-1 text-xs font-medium ${roleColor}`}
										>
											{user.role}
										</span>
									</Table.Cell>
									<Table.Cell>
										<span
											className={`rounded-full px-2 py-1 text-xs font-medium ${
												user.isActive
													? 'bg-ctp-green/20 text-ctp-green'
													: 'bg-ctp-red/20 text-ctp-red'
											}`}
										>
											{user.isActive ? 'Active' : 'Inactive'}
										</span>
									</Table.Cell>
									<Table.Cell className='text-ctp-subtext0 text-sm'>
										{formattedCreatedAt}
									</Table.Cell>
									<Table.Cell className='text-ctp-subtext0 text-sm'>
										{formattedUpdatedAt}
									</Table.Cell>

									<Table.Cell truncate={false}>
										<ActionMenu
											orientation='horizontal'
											ariaLabel={`Actions for user #${user.id}`}
											items={[
												...(onEditUser
													? [
															{
																label: 'Edit user',
																icon: <Pencil size={16} />,
																onClick: () => onEditUser(user),
																variant: 'default' as const,
															},
														]
													: []),
												{
													label: 'Delete user',
													icon: <Trash2 className='h-4 w-4' />,
													onClick: () => {
														void handleDeleteUser(user.id);
													},
													variant: 'destructive',
												},
											]}
										/>
									</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			</div>
		</div>
	);
};
