export const orderEndpoints = {
	list: '/orders',
	create: '/orders',
	meta: '/orders/meta',
	detail: (id: string) => `/orders/${id}`,
	update: (id: string) => `/orders/${id}`,
	delete: (id: string) => `/orders/${id}`,
};
