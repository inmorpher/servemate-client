'use client';

import { Filter } from '@/shared/components/filter';
import { useDrinkFilters } from '../hooks/useDrinkFilters';

const inputClassName =
	'bg-ctp-surface0 border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:ring-ctp-blue w-full rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none';

export const DrinkFilters = ({ tabId }: { tabId: string }) => {
	const {
		filters,
		nameValue,
		categoryValue,
		handleNameChange,
		handleCategoryChange,
		handleAvailabilityChange,
		handleVolumeChange,
		handleClearFilters,
		hasFilters,
	} = useDrinkFilters(tabId);

	return (
		<Filter className='max-h-dvh'>
			<button
				type='button'
				className='text-ctp-red hover:bg-ctp-red/10 focus:bg-ctp-red/20 h-10 w-full rounded-md px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50'
				onClick={handleClearFilters}
				disabled={!hasFilters}
			>
				Clear filters
			</button>

			<Filter.Group label='Drinks'>
				<div className='grid w-full gap-3'>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Name
						<input
							className={inputClassName}
							value={nameValue}
							onChange={(event) => handleNameChange(event.currentTarget.value)}
							placeholder='Search by name'
						/>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Category
						<input
							className={inputClassName}
							value={categoryValue}
							onChange={(event) => handleCategoryChange(event.currentTarget.value)}
							placeholder='Search by category'
						/>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Availability
						<select
							className={inputClassName}
							value={
								filters?.isAvailable === undefined
									? ''
									: String(filters.isAvailable)
							}
							onChange={(event) =>
								handleAvailabilityChange(event.currentTarget.value)
							}
						>
							<option value=''>All statuses</option>
							<option value='true'>Available</option>
							<option value='false'>Unavailable</option>
						</select>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Volume
						<input
							className={inputClassName}
							type='number'
							min={0}
							step='any'
							value={filters?.volume ?? ''}
							onChange={(event) => handleVolumeChange(event.currentTarget.value)}
						/>
					</label>
				</div>
			</Filter.Group>
		</Filter>
	);
};
