'use client';

import { Search } from '@/features/search';
import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { Filter } from '@/shared/components/filter';
import RangeSlider from '@/shared/components/slider/ui/Slider';
import { OrderMetaDTO } from '@servemate/dto';
import { UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';

export const OrderFilters = ({
	ordersMeta,
	updateFilters,
}: {
	ordersMeta: UseQueryResult<OrderMetaDTO, unknown>;
	updateFilters: (filters: Partial<OrderMetaDTO>) => void;
}) => {
	//TODO: убрать хук useGetOrders, если он не нужен,
	// добавть логику получения orderSearchCriteria в useGetOrdersMeta
	// сделать универсальную функцию для получения критериев из поиска и их изменений
	const [searchValue, setSearchValue] = useState('');

	// const { minAmount, maxAmount } = useSearchCriteria({
	// 	schema: OrderSearchSchema,
	// 	numberFields: ['minAmount', 'maxAmount'],
	// });

	// const { data: ordersMeta, isSuccess } = useGetOrdersMeta();

	// useEffect(() => {
	// 	// Sync searchValue with URL state
	// 	setSearchValue(ordersMeta.id?.toString() || '');
	// }, [orderSearchCriteria.id]);

	/**
	 * Handles changes to the price range slider.
	 * Updates the search criteria with the selected minimum and maximum amounts.
	 *
	 * @param values - An array containing the minimum and maximum price values.
	 */
	const handlePriceRangeChange = (values: number[]) => {
		const [minAmount, maxAmount] = values;
		console.log('Price range changed:', { minAmount, maxAmount });
		// updateFilters({
		// 	minAmount,
		// 	maxAmount,
		// });
	};

	//

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('Submitting search for Order ID:', searchValue);
		// updateFilters({
		// 	id: searchValue.trim() ? Number(searchValue) : undefined,
		// });
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
			{ordersMeta.isSuccess && ordersMeta.data?.allergies && (
				<Filter.Group label='Allergies'>
					{orderSearchOptions.allergies.map((option) => (
						<SearchChip
							key={option.value}
							isActive={ordersMeta.data.allergies?.includes(option.value)}
							onClick={() => {
								const newAllergies = ordersMeta.data.allergies?.includes(option.value)
									? ordersMeta.data.allergies.filter((a) => a !== option.value)
									: [...(ordersMeta.data.allergies || []), option.value];
								updateFilters({ allergies: newAllergies });
							}}
						>
							{option.value}
						</SearchChip>
					))}
				</Filter.Group>
			)}

			{/* Price Range Filter */}
			{ordersMeta.isSuccess && ordersMeta.data?.prices && (
				<Filter.Group label='Price Range'>
					<RangeSlider
						minValue={ordersMeta.data.prices.min}
						maxValue={ordersMeta.data.prices.max}
						handler={handlePriceRangeChange}
						defaultValue={[ordersMeta.data.prices.min, ordersMeta.data.prices.max]}
					/>
				</Filter.Group>
			)}

			{/* Status Filter */}
			<Filter.Group label='Status'>
				{orderSearchOptions.statuses.map((option) => (
					<SearchChip
						key={option.value}
						isActive={ordersMeta.data?.statuses?.includes(option.value)}
						onClick={() => {
							const isActive = ordersMeta.data?.statuses?.includes(option.value);
							const newStatuses = isActive ? undefined : [option.value];
							updateFilters({ statuses: newStatuses });
						}}
					>
						{option.label}
					</SearchChip>
				))}
			</Filter.Group>
		</Filter>
	);
};
