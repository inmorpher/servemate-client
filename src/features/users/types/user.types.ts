import type { paths } from '@/shared/api/api-types';

export type User =
	paths['/api/users']['get']['responses']['200']['content']['application/json']['users'][number];
export type UserListItem = User;
export type UserMeta =
	paths['/api/users/meta']['get']['responses']['200']['content']['application/json'];
