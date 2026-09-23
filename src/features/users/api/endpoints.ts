export const usersEndpoints = {
	list: '/users',
	meta: '/users/meta',
	detail: (id: string) => `/users/${id}`,
	delete: (id: string) => `/users/${id}`,
};
