'use client';

import { Search } from '@/features/search';
import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { Filter } from '@/shared/components/filter';
import Pagination from '@/shared/components/pagination/Paginations';
import AppSlider from '@/shared/components/slider/ui/Slider';
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
	const [priceRange, setPriceRange] = useState([20, 80]);

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
			<Filter title='Search Orders'>
				{/* <OrderSearchBar
					isLoading={isLoading}
					updateCriteria={updateSearchCriteria}
					criteria={orderSearchCriteria}
				/> */}
				<Search onSubmit={handleSubmit}>
					<Search.Input
						value={searchValue || ''}
						onChange={(e) => setSearchValue(e.target.value)}
						placeholder='Search orders...'
					/>
				</Search>

				<Filter.Group label='Allergies'>
					{orderSearchOptions.allergies.map((option) => (
						<SearchChip key={option.value} className='m-2'>
							{option.value}
						</SearchChip>
					))}
				</Filter.Group>

				<Filter.Group label='Slider'>
					<div className='px-2 py-4'>
						<AppSlider
							range
							min={0}
							max={100}
							value={priceRange}
							onChange={(value) => setPriceRange(value as number[])}
							className='mb-4'
						/>
						<div className='flex justify-between text-sm text-gray-500'>
							<span>${priceRange[0]}</span>
							<span>${priceRange[1]}</span>
						</div>
					</div>
				</Filter.Group>

				<Filter.Group label='Status'>
					{orderSearchOptions.statuses.map((option) => (
						<SearchChip key={option.value} className='m-2'>
							{option.value}
						</SearchChip>
					))}
				</Filter.Group>
			</Filter>
		</div>
	);
};
