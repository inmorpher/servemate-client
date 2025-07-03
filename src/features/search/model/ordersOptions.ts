import { Allergy, OrderSortOptions } from '@servemate/dto';

/**
 * Provides configuration options for searching orders.
 *
 * @property allergies - An array of allergy options, each with a `label` and `value`, generated from the `Allergy` enum.
 * @property statuses - An array of status options for filtering orders by their state.
 * @property sortOptions - An array of sorting options, each with a `label` and `value`, generated from the `OrderSortColumn` enum.
 */
export const orderSearchOptions = {
	allergies: [
		...Object.entries(Allergy).map(([key, value]) => ({
			label: key,
			value: value,
		})),
	],
	statuses: [
		{ label: 'Pending', value: 'pending' },
		{ label: 'Confirmed', value: 'confirmed' },
		{ label: 'In Progress', value: 'in_progress' },
		{ label: 'Completed', value: 'completed' },
		{ label: 'Cancelled', value: 'cancelled' },
	],
	sortOptions: [
		...Object.entries(OrderSortOptions).map(([key, value]) => ({
			label: key,
			value: value,
		})),
	],
};
