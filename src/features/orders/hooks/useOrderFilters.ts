import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { Tab } from '@/shared/components/tabs/types/tabs.type';
import { Allergies, OrderMetaDTO, OrderSearchCriteria, OrderState } from '@servemate/dto';
import { useGetOrdersMeta } from './useGetOrdersMeta';

export interface OrdersListPageProps {
	tabId: Tab['id'];
	tab?: Tab<OrderSearchCriteria> | undefined;
}
export const useOrderFilters = () => {
	// Fetching metadata for filters (like available statuses, tables, etc.)
	const { data: metaData }: { data: OrderMetaDTO | undefined } = useGetOrdersMeta();

	// Getting state from Zustand store for tabs
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

	const handleClearFilters = () => {
		if (currentTab) {
			updateTab(currentTab.id, { filters: undefined });
		}
	};

	return {
		metaData: metaData as OrderMetaDTO | undefined,
		filters,
		handleAllergyToggle,
		handlePriceRangeChange,
		handleStatusToggle,
		handleTableNumber,
		handleRangeChange,
		handleClearFilters,
	};
};
