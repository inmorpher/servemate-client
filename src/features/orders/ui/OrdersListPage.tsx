'use client';

import { Search } from '@/features/search';
import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { Filter } from '@/shared/components/filter';
import Pagination from '@/shared/components/pagination/Paginations';
import AppSlider from '@/shared/components/slider/ui/Slider';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { SearchError } from '@/shared/layouts/Error';
import { ListPageLayout } from '@/shared/layouts/ListPageLayput';
import { useEffect, useState } from 'react';
import { useGetOrders } from '../hooks/useGetOrders';
import { OrderList } from './OrderList';
export const OrdersListPage = () => {
	const {
		data: ordersData,
		isLoading,
		isFetching,
		error,
		isError,
		orderSearchCriteria,
		refetch,
		updateSearchCriteria,
	} = useGetOrders();

	const [searchValue, setSearchValue] = useState<string>('');
	const [priceRange, setPriceRange] = useState([0, 100]); // Default to 0-100 for initial range

	const [minPriceInput, setMinPriceInput] = useState(0);
	const [maxPriceInput, setMaxPriceInput] = useState(100);

	// Получаем реальные границы из данных
	const realMinPrice = ordersData?.priceRange?.min || 0;
	const realMaxPrice = ordersData?.priceRange?.max || 100;

	const debouncedMinPrice = useDebounce(minPriceInput, 500);
	const debouncedMaxPrice = useDebounce(maxPriceInput, 500);

	// Инициализируем значения когда данные загружены
	useEffect(() => {
		if (ordersData?.priceRange) {
			const { min, max } = ordersData.priceRange;
			setPriceRange([min, max]);
			setMinPriceInput(min);
			setMaxPriceInput(max);
		}
	}, [ordersData?.priceRange]);

	useEffect(() => {
		// Update priceRange when debounced input values change
		const newMin = Number(debouncedMinPrice);
		const newMax = Number(debouncedMaxPrice);

		if (
			!isNaN(newMin) &&
			!isNaN(newMax) &&
			(newMin !== priceRange[0] || newMax !== priceRange[1])
		) {
			setPriceRange([newMin, newMax]);
		}
	}, [debouncedMinPrice, debouncedMaxPrice]);

	useEffect(() => {
		// Update input fields when priceRange changes (e.g., from slider)
		setMinPriceInput(priceRange[0]);
		setMaxPriceInput(priceRange[1]);
	}, [priceRange]);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [orderSearchCriteria]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('Search submitted with value:', searchValue);
		if (searchValue.trim()) {
			updateSearchCriteria({
				...orderSearchCriteria,
				id: Number(searchValue) || undefined,
			});
		}
	};
	console.log('isFetching', isFetching);

	const { totalCount, pageSize, page, totalPages } = ordersData || {};
	const effectivePageSize = pageSize ?? orderSearchCriteria.pageSize ?? 10;

	return (
		<div className='flex h-full relative'>
			<ListPageLayout
				footer={
					<Pagination
						data={{ totalCount, totalPages, page, pageSize }}
						updateSearchCriteria={updateSearchCriteria}
					/>
				}
			>
				{isError ? (
					<SearchError error={error.message} refetch={refetch} />
				) : (
					<OrderList
						isFetching={isFetching}
						isLoading={isLoading}
						orders={ordersData?.orders}
						pageSize={effectivePageSize}
					/>
				)}
			</ListPageLayout>
			{/* Filter Sidebar */}
			<Filter title='Search Orders'>
				<Search onSubmit={handleSubmit}>
					<Search.Input
						value={searchValue || ''}
						onChange={(e) => setSearchValue(e.target.value)}
						placeholder='Search orders...'
					/>
				</Search>

				<Filter.Group label='Allergies'>
					{orderSearchOptions.allergies
						.filter((option) => option.value !== 'NONE')
						.map((option) => (
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

				<Filter.Group label='Price Range'>
					<AppSlider
						range
						min={realMinPrice}
						max={realMaxPrice}
						value={priceRange}
						onChange={(value) => setPriceRange(value as number[])}
					/>
					<div className='flex justify-between items-center mt-2'>
						<input
							type='number'
							value={minPriceInput}
							onChange={(e) => setMinPriceInput(Number(e.target.value))}
							className='w-20 p-1 border border-gray-300 rounded-md text-sm text-center'
							min={realMinPrice}
							max={realMaxPrice}
						/>
						<span className='mx-2 text-gray-500'>-</span>
						<input
							type='number'
							value={maxPriceInput}
							onChange={(e) => setMaxPriceInput(Number(e.target.value))}
							className='w-20 p-1 border border-gray-300 rounded-md text-sm text-center'
							min={realMinPrice}
							max={realMaxPrice}
						/>
					</div>
				</Filter.Group>

				<Filter.Group label='Status'>
					{orderSearchOptions.statuses.map((option) => (
						<SearchChip
							key={option.value}
							isActive={orderSearchCriteria.status?.includes(option.value)}
							onClick={() => {
								const newStatuses = orderSearchCriteria.status?.includes(option.value)
									? orderSearchCriteria.status.filter((s) => s !== option.value)
									: [...(orderSearchCriteria.status || []), option.value];
								updateSearchCriteria({ status: newStatuses });
							}}
						>
							{option.value}
						</SearchChip>
					))}
				</Filter.Group>
			</Filter>
		</div>
	);
};
