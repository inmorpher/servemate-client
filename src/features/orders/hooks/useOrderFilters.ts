import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useApiQuery } from '@/shared/hooks/useApiQuery';
import { Allergies, OrderMetaDTO, OrderSearchCriteria, OrderState } from '@servemate/dto';

export interface OrdersListPageProps {
	tabId: Tab['id'];
	tab?: Tab<OrderSearchCriteria> | undefined;
}
export const useOrderFilters = () => {
	// Fetching metadata for filters (like available statuses, tables, etc.)
	const { data: metaData } = useApiQuery<OrderMetaDTO>('/orders/meta', undefined, {
		staleTime: 5 * 60 * 1000,
		refetchInterval: 5 * 60 * 1000,
	});

	// Getting state from Zustand store for tabs
	const clearFilters = useTabs((state) => state.clearFilters);
	const currentTab = useTabs((state) => state.getTabById(state.activeTabId));
	const updateTab = useTabs((state) => state.updateTab);

	if (!currentTab) {
		return {
			metaData: undefined,
			filters: undefined,
			handleAllergyToggle: () => {},
			handlePriceRangeChange: () => {},
			handleStatusToggle: () => {},
			handleTableNumber: () => {},
			handleRangeChange: () => {},
		};
	}

	const filters:
		| (Partial<OrderSearchCriteria> & { fromDate?: string; toDate?: string })
		| undefined = currentTab.filters;

	// Handlers

	// Price range change handler
	const handlePriceRangeChange = (values: number[]) => {
		const [filteredMin, filteredMax] = values;
		updateTab(currentTab.id, {
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

		updateTab(currentTab.id, {
			filters: { ...filters, allergies: mewAllergies },
		});
	};

	const handleStatusToggle = (status: string) => {
		const current: OrderState | '' = filters?.status || '';

		const newStatus = current === status ? '' : status;

		updateTab(currentTab.id, {
			filters: { ...filters, status: newStatus },
		});
	};

	const handleTableNumber = (table: number) => {
		const currentTables: number[] = filters?.tableNumbers || [];

		const newTable = currentTables.includes(table)
			? currentTables.filter((t) => t !== table)
			: [...currentTables, table];
		updateTab(currentTab.id, {
			filters: { ...filters, tableNumbers: newTable.length ? newTable : undefined },
		});
	};

	const handleRangeChange = (range: {
		startDate: Date | undefined;
		endDate: Date | undefined;
	}) => {
		updateTab(currentTab.id, {
			filters: {
				...filters,
				dateFrom: range.startDate?.toISOString(),
				dateTo: range.endDate?.toISOString(),
			},
		});
	};

	const hnaldeClearFilters = () => {
		if (currentTab) {
		}
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
