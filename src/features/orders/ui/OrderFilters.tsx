'use client';

import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { DateRangePicker } from '@/shared/components/date-range-picker';
import { Filter } from '@/shared/components/filter/index';
import FilterReset from '@/shared/components/filter/ui/FilterReset';
import { useOrderFilters } from '../hooks/useOrderFilters';
import { PriceRangeFilter } from './PriceRangeFilter';

export const OrderFilters = () => {
	const {
		metaData,
		filters,
		handleAllergyToggle,
		handlePriceRangeChange,
		handleStatusToggle,
		handleTableNumber,
		handleRangeChange,
	} = useOrderFilters();

	return (
		<Filter>
			<FilterReset filters={filters} />
			{/* Date Range Filter */}
			{metaData?.dates && (
				<Filter.Group label='Order Date'>
					<DateRangePicker
						dates={{
							startDate: filters?.dateFrom
								? new Date(filters.dateFrom).toDateString()
								: metaData.dates.min,
							endDate: filters?.dateTo
								? new Date(filters.dateTo).toDateString()
								: metaData.dates.max,
						}}
						onRangeChange={handleRangeChange}
					/>
				</Filter.Group>
			)}
			{/* Allergies Filter */}
			{metaData?.allergies && (
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
			{metaData?.prices && (
				<Filter.Group label='Price Range'>
					<PriceRangeFilter
						minValue={metaData.prices.min}
						maxValue={metaData.prices.max}
						onChange={handlePriceRangeChange}
						value={
							filters?.minAmount && filters?.maxAmount
								? [filters.minAmount, filters.maxAmount]
								: [metaData.prices.min, metaData.prices.max]
						}
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
				{metaData?.tableNumbers.map((t: number) => (
					<SearchChip
						key={t}
						isActive={filters?.tableNumbers?.includes(t)}
						onClick={() => handleTableNumber(t)}
					>
						{t}
					</SearchChip>
				))}
			</Filter.Group>
			{
				/////// Additional filters can be added here in the future
			}
		</Filter>
	);
};

export default OrderFilters;
