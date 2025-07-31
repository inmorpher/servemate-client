import { buildApiUrl } from '@/shared/utils/buildApiUrl';
import { OrderSearchCriteria } from '@servemate/dto';
import { orderEndpoints } from './endpoints';

export const orderApiClient = {
	getOrders: async (params?: OrderSearchCriteria) => {
		const url = buildApiUrl(orderEndpoints.list, params);

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Failed to fetch orders');
		}

		return await response.json();
	},
	getMeta: async (params?: OrderSearchCriteria) => {
		const url = buildApiUrl(orderEndpoints.meta, params);

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Failed to fetch orders meta');
		}

		return await response.json();
	},
};
