'use client';

import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { useTabs } from '@/features/tabs/store/useTabs';
import { DateRangeInput, Filter } from '@/shared/components/filter/index';
import RangeSlider from '@/shared/components/slider/ui/Slider';
import { Allergies, OrderMetaDTO, OrderSearchCriteria, OrderState } from '@servemate/dto';
import { startTransition } from 'react';

type OrderFiltersProps = {
	ordersMeta?: OrderMetaDTO;
	updateFilters?: (filters: Partial<OrderSearchCriteria>) => void;
	filters?: Partial<OrderSearchCriteria> & { fromDate?: string; toDate?: string };
};

export const OrderFilters = ({ ordersMeta, updateFilters, filters }: OrderFiltersProps) => {
	const { updateTab, activeTabId } = useTabs();

	// Initialize fromDate and toDate with metadata dates on first load
	// useEffect(() => {
	// 	const updates: Partial<OrderSearchCriteria & { fromDate?: string; toDate?: string }> = {};

	// 	if (ordersMeta?.dates?.min && !filters?.fromDate) {
	// 		updates.fromDate = ordersMeta.dates.min;
	// 	}

	// 	if (ordersMeta?.dates?.max && !filters?.toDate) {
	// 		updates.toDate = ordersMeta.dates.max;
	// 	}

	// 	if (Object.keys(updates).length > 0) {
	// 		updateTab(activeTabId, {
	// 			filters: { ...filters, ...updates },
	// 		});
	// 	}
	// }, [ordersMeta?.dates?.min, ordersMeta?.dates?.max, activeTabId, updateTab]);

	const handlePriceRangeChange = (values: number[]) => {
		startTransition(() => {
			const [filteredMin, filteredMax] = values;
			updateTab(activeTabId, {
				filters: {
					...filters,
					minAmount: filteredMin,
					maxAmount: filteredMax,
				},
			});
		});
	};

	const handleAllergyToggle = (allergy: string) => {
		startTransition(() => {
			const currentAllergies: Allergies[] = filters?.allergies || [];

			const mewAllergies = currentAllergies.includes(allergy as Allergies)
				? currentAllergies.filter((a) => a !== allergy)
				: [...currentAllergies, allergy as Allergies];

			updateTab(activeTabId, {
				filters: { ...filters, allergies: mewAllergies },
			});
		});
	};
	const handleStatusToggle = (status: string) => {
		startTransition(() => {
			const current: OrderState | '' = filters?.status || '';

			const newStatus = current === status ? '' : status;

			updateTab(activeTabId, {
				filters: { ...filters, status: newStatus },
			});
		});
	};

	const handleTableNumber = (table: number) => {
		startTransition(() => {
			const currentTables: number[] = filters?.tableNumbers || [];

			const newTable = currentTables.includes(table)
				? currentTables.filter((t) => t !== table)
				: [...currentTables, table];
			updateTab(activeTabId, {
				filters: { ...filters, tableNumbers: newTable.length ? newTable : undefined },
			});
		});
	};

	// TODO: Date Range Handlers
	const handleFromDateChange = (date: string) => {
		startTransition(() => {
			updateTab(activeTabId, {
				filters: { ...filters, fromDate: date || undefined },
			});
		});
	};

	const handleToDateChange = (date: string) => {
		startTransition(() => {
			console.log('To date changed:', date);
			updateTab(activeTabId, {
				filters: { ...filters, toDate: date || undefined },
			});
		});
	};

	return (
		<Filter className='max-h-dvh'>
			{/* Date Range Filter */}
			{ordersMeta?.dates && (
				<Filter.Group label='Order Date'>
					<DateRangeInput
						fromDate={filters?.fromDate}
						toDate={filters?.toDate}
						onFromDateChange={handleFromDateChange}
						onToDateChange={handleToDateChange}
						minDate={ordersMeta.dates.min}
						maxDate={ordersMeta.dates.max}
					/>
				</Filter.Group>
			)}
			{/* Allergies Filter */}
			{ordersMeta?.allergies && (
				<Filter.Group label='Allergies'>
					{orderSearchOptions.allergies.map((option) => (
						<SearchChip
							key={option.value}
							isActive={filters?.allergies?.includes(option.value)}
							onClick={() => handleAllergyToggle(option.value)}
						>
							{option.value}
						</SearchChip>
					))}
				</Filter.Group>
			)}
			{/* Price Range Filter */}
			{ordersMeta?.prices && (
				<Filter.Group label='Price Range'>
					<RangeSlider
						minValue={ordersMeta.prices.min}
						maxValue={ordersMeta.prices.max}
						handler={handlePriceRangeChange}
						defaultValue={[ordersMeta.prices.min, ordersMeta.prices.max]}
					/>
				</Filter.Group>
			)}
			{/* Status Filter */}
			<Filter.Group label='Status'>
				{orderSearchOptions.statuses.map((option) => (
					<SearchChip
						key={option.value}
						isActive={filters?.status === option.value}
						onClick={() => handleStatusToggle(option.value)}
					>
						{option.label}
					</SearchChip>
				))}
			</Filter.Group>
			<Filter.Group label='Tables'>
				{ordersMeta?.tableNumbers.map((t) => (
					<SearchChip
						key={t}
						isActive={filters?.tableNumbers?.includes(t)}
						onClick={() => handleTableNumber(t)}
					>
						{t}
					</SearchChip>
				))}
			</Filter.Group>
			//for test perposes
			{ordersMeta?.prices && (
				<Filter.Group label='Price Range'>
					<RangeSlider
						minValue={ordersMeta.prices.min}
						maxValue={ordersMeta.prices.max}
						handler={handlePriceRangeChange}
						defaultValue={[ordersMeta.prices.min, ordersMeta.prices.max]}
					/>
				</Filter.Group>
			)}
			<Filter.Group label='Tables'>
				{ordersMeta?.tableNumbers.map((t) => (
					<SearchChip
						key={t}
						isActive={filters?.tableNumbers?.includes(t)}
						onClick={() => handleTableNumber(t)}
					>
						{t}
					</SearchChip>
				))}
			</Filter.Group>
		</Filter>
	);
};
