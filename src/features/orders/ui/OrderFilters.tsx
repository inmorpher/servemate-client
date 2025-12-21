'use client';

import { Search } from '@/features/search';
import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { Filter } from '@/shared/components/filter';
import RangeSlider from '@/shared/components/slider/ui/Slider';
import { OrderMetaDTO, OrderSearchCriteria } from '@servemate/dto';
import { UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';

type OrderFiltersProps = {
	ordersMeta: UseQueryResult<OrderMetaDTO, unknown>;
	updateFilters?: (filters: Partial<OrderSearchCriteria>) => void;
};

export const OrderFilters = ({
	ordersMeta,
	updateFilters,
}: {
	ordersMeta: OrderMetaDTO;
	updateFilters?: (filters: Partial<OrderSearchCriteria>) => void;
}) => {
	const [searchValue, setSearchValue] = useState('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// const id = searchValue.trim() ? Number(searchValue) : undefined;
		// updateFilters({ id });
	};

	const handlePriceRangeChange = (values: number[]) => {
		const [minAmount, maxAmount] = values;
		// updateFilters({ minAmount, maxAmount });
	};

	const handleAllergyToggle = (allergy: string) => {
		const current = ordersMeta?.allergies || [];
		// const newAllergies = current.includes(allergy)
		// 	? current.filter((a) => a !== allergy)
		// 	: [...current, allergy];
		// updateFilters({ allergies: newAllergies });
	};

	const handleStatusToggle = (status: string) => {
		const current = ordersMeta?.statuses || [];
		// const newStatuses = current.includes(status)
		// 	? current.filter((s) => s !== status)
		// 	: [...current, status];
		// updateFilters({ statuses: newStatuses });
	};

	return (
		<Filter title='Search Orders' className='max-h-dvh'>
			<Search onSubmit={handleSubmit}>
				<Search.Input
					value={'1233'}
					onChange={(e) => setSearchValue(e.target.value)}
					placeholder='Search by Order ID...'
				/>
			</Search>

			{/* Allergies Filter */}
			{ordersMeta.allergies && (
				<Filter.Group label='Allergies'>
					{orderSearchOptions.allergies.map((option) => (
						<SearchChip
							key={option.value}
							isActive={ordersMeta.allergies?.includes(option.value)}
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
						isActive={ordersMeta?.statuses?.includes(option.value)}
						onClick={() => handleStatusToggle(option.value)}
					>
						{option.label}
					</SearchChip>
				))}
			</Filter.Group>
		</Filter>
	);
};
