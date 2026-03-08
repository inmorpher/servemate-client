'use client';

import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { DateRangePicker } from '@/shared/components/date-range-picker';
import { Filter } from '@/shared/components/filter/index';
import RangeSlider from '@/shared/components/slider/ui/Slider';
import { useOrderFilters } from '../hooks/useOrderFilters';

const OrderFilters = () => {
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
		<Filter className='max-h-dvh'>
			{/* Date Range Filter */}
			{metaData?.dates && (
				<Filter.Group label='Order Date'>
					<DateRangePicker
						dates={{
							startDate: metaData.dates.min,
							endDate: metaData.dates.max,
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
					<RangeSlider
						minValue={metaData.prices.min}
						maxValue={metaData.prices.max}
						handler={handlePriceRangeChange}
						defaultValue={[metaData.prices.min, metaData.prices.max]}
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
				{metaData?.tableNumbers.map((t) => (
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

export default OrderFilters;
