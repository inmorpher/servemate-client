import { useSearchCriteria } from '@/shared/hooks/useSearchCriteria';

export const useOrderSearchCriteria = () => {
	const orderSearchCriteria = useSearchCriteria({
		schema: OrderSearchSchema,
		numberFields: ['id', 'page', 'pageSize', 'guestsCount', 'minAmount', 'maxAmount'],
		arrayFields: ['status'],
	});
};
