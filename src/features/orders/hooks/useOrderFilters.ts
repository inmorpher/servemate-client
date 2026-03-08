import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { Allergies, OrderMetaDTO, OrderSearchCriteria, OrderState } from '@servemate/dto';

export const useOrderFilters = () => {
	// Fetching metadata for filters (like available statuses, tables, etc.)
	const { data: metaData } = useApiQuery<OrderMetaDTO>('/orders/meta', undefined, {
		staleTime: 5 * 60 * 1000,
		refetchInterval: 5 * 60 * 1000,
	});

	// Getting state from Zustand store for tabs
	const { activeTabId, getTabById, updateTab } = useTabs();
	const currentTab = getTabById(activeTabId);

	console.log('hook Tab', currentTab);
	const filters:
		| (Partial<OrderSearchCriteria> & { fromDate?: string; toDate?: string })
		| undefined = currentTab?.filters;

	// Handlers

	// Price range change handler
	const handlePriceRangeChange = (values: number[]) => {
		const [filteredMin, filteredMax] = values;
		updateTab(activeTabId, {
			filters: {
				...filters,
				minAmount: filteredMin,
				maxAmount: filteredMax,
			},
		});
	};

	// Handle allergy toggle
	const handleAllergyToggle = (allergy: string) => {
		const currentAllergies: Allergies[] = filters?.allergies || [];

		const mewAllergies = currentAllergies.includes(allergy as Allergies)
			? currentAllergies.filter((a) => a !== allergy)
			: [...currentAllergies, allergy as Allergies];

		updateTab(activeTabId, {
			filters: { ...filters, allergies: mewAllergies },
		});
	};

	const handleStatusToggle = (status: string) => {
		const current: OrderState | '' = filters?.status || '';

		const newStatus = current === status ? '' : status;

		updateTab(activeTabId, {
			filters: { ...filters, status: newStatus },
		});
	};

	const handleTableNumber = (table: number) => {
		const currentTables: number[] = filters?.tableNumbers || [];

		const newTable = currentTables.includes(table)
			? currentTables.filter((t) => t !== table)
			: [...currentTables, table];
		updateTab(activeTabId, {
			filters: { ...filters, tableNumbers: newTable.length ? newTable : undefined },
		});
	};

	const handleRangeChange = (range: {
		startDate: Date | undefined;
		endDate: Date | undefined;
	}) => {
		console.log('Selected Range', range);
		updateTab(activeTabId, {
			filters: {
				...filters,
				fromDate: range.startDate?.toISOString(),
				toDate: range.endDate?.toISOString(),
			},
		});
	};

	return {
		metaData,
		filters,
		handleAllergyToggle,
		handlePriceRangeChange,
		handleStatusToggle,
		handleTableNumber,
		handleRangeChange,
	};
};
