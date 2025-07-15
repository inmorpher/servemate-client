'use client';

import { Search } from '@/features/search';
import { orderSearchOptions } from '@/features/search/model/ordersOptions';
import { SearchChip } from '@/features/search/ui/SearchChip';
import { Filter } from '@/shared/components/filter';
import Pagination from '@/shared/components/pagination/Paginations';
import RangeSlider from '@/shared/components/slider/ui/Slider';
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

	const handlePriceRangeChange = (values: number[]) => {
		const [minAmount, maxAmount] = values;
		updateSearchCriteria({
			minAmount,
			maxAmount,
		});
	};

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [orderSearchCriteria]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (searchValue.trim()) {
			updateSearchCriteria({
				...orderSearchCriteria,
				id: Number(searchValue) || undefined,
			});
		}
	};

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

				{/* Order ID Filter */}
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

				{/* Price Range Filter */}
				{ordersData?.priceRange && (
					<Filter.Group label='Price Range'>
						<RangeSlider
							minValue={ordersData.priceRange.min}
							maxValue={ordersData.priceRange.max}
							handler={(values) => handlePriceRangeChange(values)}
						/>
					</Filter.Group>
				)}

				{/* Status Filter */}
				<Filter.Group label='Status'>
					{orderSearchOptions.statuses.map((option) => (
						<SearchChip
							key={option.label}
							isActive={orderSearchCriteria.status === option.label}
							onClick={() => {
								// Если статус уже выбран, сбрасываем его, иначе устанавливаем новый
								const newStatus =
									orderSearchCriteria.status === option.value ? undefined : option.value;
								updateSearchCriteria({ status: newStatus });
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
