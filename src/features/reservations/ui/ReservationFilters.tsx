'use client';

import { Filter } from '@/shared/components/filter';
import { useReservationFilters } from '../hooks/useReservationFilters';
import type { ReservationSearchCriteria } from '../types';

const inputClassName =
	'bg-ctp-surface0 border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:ring-ctp-blue w-full rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none';

export const ReservationFilters = ({ tabId }: { tabId: string }) => {
	const {
		filters,
		nameValue,
		emailValue,
		phoneValue,
		setNameValue,
		setEmailValue,
		setPhoneValue,
		updateFilters,
		handleTimeRangeChange,
		handleClearFilters,
		hasFilters,
	} = useReservationFilters(tabId);

	return (
		<Filter className='max-h-dvh'>
			<button
				type='button'
				className='text-ctp-red hover:bg-ctp-red/10 focus:bg-ctp-red/20 w-full rounded-md px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50'
				onClick={handleClearFilters}
				disabled={!hasFilters}
			>
				Clear filters
			</button>

			<Filter.Group label='Contact'>
				<div className='grid w-full gap-3'>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Name
						<input
							className={inputClassName}
							value={nameValue}
							onChange={(event) => setNameValue(event.currentTarget.value)}
							placeholder='Search by name'
						/>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Email
						<input
							className={inputClassName}
							type='email'
							value={emailValue}
							onChange={(event) => setEmailValue(event.currentTarget.value)}
							placeholder='Search by email'
						/>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Phone
						<input
							className={inputClassName}
							type='tel'
							value={phoneValue}
							onChange={(event) => setPhoneValue(event.currentTarget.value)}
							placeholder='Search by phone'
						/>
					</label>
				</div>
			</Filter.Group>

			<Filter.Group label='Reservation'>
				<div className='grid w-full gap-3'>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Status
						<input
							className={inputClassName}
							value={filters?.status ?? ''}
							onChange={(event) =>
								updateFilters({
									status: event.currentTarget.value || undefined,
								} as Partial<ReservationSearchCriteria>)
							}
							placeholder='Search by status'
						/>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Minimum guests
						<input
							className={inputClassName}
							type='number'
							min={1}
							value={filters?.guestsCountMin ?? ''}
							onChange={(event) =>
								updateFilters({
									guestsCountMin: event.currentTarget.value
										? Number(event.currentTarget.value)
										: undefined,
								})
							}
						/>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Maximum guests
						<input
							className={inputClassName}
							type='number'
							min={1}
							value={filters?.guestsCountMax ?? ''}
							onChange={(event) =>
								updateFilters({
									guestsCountMax: event.currentTarget.value
										? Number(event.currentTarget.value)
										: undefined,
								})
							}
						/>
					</label>
					<label className='text-ctp-subtext1 block text-sm font-medium'>
						Table ID
						<input
							className={inputClassName}
							type='number'
							min={1}
							value={filters?.tables?.[0] ?? ''}
							onChange={(event) =>
								updateFilters({
									tables: event.currentTarget.value
										? [Number(event.currentTarget.value)]
										: undefined,
								})
							}
						/>
					</label>
					<Filter.DateRange
						from={filters?.timeStart}
						to={filters?.timeEnd}
						onChange={handleTimeRangeChange}
					/>
				</div>
			</Filter.Group>
		</Filter>
	);
};
