import { apiRequest } from '@/shared/utils/apiRequest';

import {
	CreateUserDto,
	UpdateUserDto,
	UserListItem,
	UserListResult,
	UserSearchCriteria,
} from '@servemate/dto';

import { usersEndpoints } from './endpoints';

export type UsersApiClient = {
	getUsers: (params?: UserSearchCriteria) => Promise<UserListResult>;
	getUser: (id: string) => Promise<UserListItem>;
	createUser: (body: CreateUserDto) => Promise<void>;
	updateUser: (id: string, body: UpdateUserDto) => Promise<void>;
	deleteUser: (id: string) => Promise<void>;
};

const requestVoid = async (endpoint: string, method: 'DELETE') => {
	await apiRequest<null>(endpoint, {
		method,
		responseMode: 'void',
	});
};

export const usersApiClient: UsersApiClient = {
	getUsers: (params) =>
		apiRequest<UserListResult>(usersEndpoints.list, {
			params,
			responseMode: 'json',
		}),
	getUser: (id) =>
		apiRequest<UserListItem>(usersEndpoints.detail(id), {
			responseMode: 'json',
		}),
	createUser: async (body) => {
		await apiRequest<null, CreateUserDto>(usersEndpoints.list, {
			method: 'POST',
			body,
			responseMode: 'void',
		});
	},
	updateUser: async (id, body) => {
		await apiRequest<null, UpdateUserDto>(usersEndpoints.detail(id), {
			method: 'PUT',
			body,
			responseMode: 'void',
		});
	},
	deleteUser: async (id) => {
		await requestVoid(usersEndpoints.delete(id), 'DELETE');
	},
};
