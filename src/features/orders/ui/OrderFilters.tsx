'use client';

import { Search } from '@/features/search';
import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { Filter } from '@/shared/components/filter';
import RangeSlider from '@/shared/components/slider/ui/Slider';
import { useEffect, useState } from 'react';
import { useGetOrders } from '../hooks/useGetOrders';
import { useGetOrdersMeta } from '../hooks/useGetOrdersMeta';

export const OrderFilters = () => {
	const {
		// data: ordersData,
		orderSearchCriteria,
		updateSearchCriteria,
	} = useGetOrders();

	const [searchValue, setSearchValue] = useState('');

	const { data: ordersMeta, isSuccess } = useGetOrdersMeta();

	useEffect(() => {
		// Sync searchValue with URL state
		setSearchValue(orderSearchCriteria.id?.toString() || '');
	}, [orderSearchCriteria.id]);

	/**
	 * Handles changes to the price range slider.
	 * Updates the search criteria with the selected minimum and maximum amounts.
	 *
	 * @param values - An array containing the minimum and maximum price values.
	 */
	const handlePriceRangeChange = (values: number[]) => {
		const [minAmount, maxAmount] = values;
		updateSearchCriteria({
			minAmount,
			maxAmount,
		});
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		updateSearchCriteria({
			id: searchValue.trim() ? Number(searchValue) : undefined,
		});
	};

	return (
		<Filter title='Search Orders'>
			<Search onSubmit={handleSubmit}>
				<Search.Input
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					placeholder='Search by Order ID...'
				/>
			</Search>

			{/* Allergies Filter */}
			{isSuccess && ordersMeta?.allergies && (
				<Filter.Group label='Allergies'>
					{orderSearchOptions.allergies.map((option) => (
						<SearchChip
							key={option.value}
							isActive={orderSearchCriteria.allergies?.includes(option.value)}
							onClick={() => {
								const newAllergies = orderSearchCriteria.allergies?.includes(option.value)
									? orderSearchCriteria.allergies.filter((a) => a !== option.value)
									: [...(orderSearchCriteria.allergies || []), option.value];
								updateSearchCriteria({ allergies: newAllergies });
							}}
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
						minValue={ordersMeta.filtered.prices.min}
						maxValue={ordersMeta.filtered.prices.max}
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
						isActive={orderSearchCriteria.status === option.value}
						onClick={() => {
							const newStatus =
								orderSearchCriteria.status === option.value ? undefined : option.value;
							updateSearchCriteria({ status: newStatus });
						}}
					>
						{option.label}
					</SearchChip>
				))}
			</Filter.Group>
		</Filter>
	);
};
