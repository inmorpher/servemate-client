'use client';

import { cn } from '@/shared/utils/classNames';
import { isSameDay } from 'date-fns';
import { useMemo } from 'react';
import {
	clampDate,
	formatDisplayDate,
	getStartOfToday,
	parseDateInput,
	toDateInputValue,
} from './date-helpers';

type DateValue = string | undefined;

interface FilterDateRangeProps {
	from?: DateValue;
	to?: DateValue;
	min?: DateValue;
	max?: DateValue;
	onChange: (range: { from?: DateValue; to?: DateValue }) => void;
}

interface DatePreset {
	label: string;
	getRange: () => { from?: DateValue; to?: DateValue };
}

// --- UTC-safe helpers: treat YYYY-MM-DD as literal calendar date ---

export const FilterDateRange = ({ from, to, min, max, onChange }: FilterDateRangeProps) => {
	const minDate = useMemo(() => (min ? parseDateInput(min) : undefined), [min]);
	const maxDate = useMemo(() => (max ? parseDateInput(max) : undefined), [max]);

	const presets: DatePreset[] = useMemo(
		() => [
			{
				label: 'All time',
				getRange: () => ({ from: min, to: max }),
			},
			{
				label: 'Today',
				getRange: () => {
					const today = clampDate(getStartOfToday(), minDate, maxDate);
					const value = toDateInputValue(today);
					return { from: value, to: value };
				},
			},
			{
				label: '7 days',
				getRange: () => {
					const to = clampDate(getStartOfToday(), minDate, maxDate);
					const from = new Date(to);
					from.setDate(to.getDate() - 6);
					return {
						from: toDateInputValue(clampDate(from, minDate, maxDate)),
						to: toDateInputValue(to),
					};
				},
			},
			{
				label: '30 days',
				getRange: () => {
					const to = clampDate(getStartOfToday(), minDate, maxDate);
					const from = new Date(to);
					from.setDate(to.getDate() - 29);
					return {
						from: toDateInputValue(clampDate(from, minDate, maxDate)),
						to: toDateInputValue(to),
					};
				},
			},
			{
				label: '365 days',
				getRange: () => {
					const to = clampDate(getStartOfToday(), minDate, maxDate);
					const from = new Date(to);
					from.setFullYear(to.getFullYear() - 1);
					from.setDate(to.getDate() + 1);
					return {
						from: toDateInputValue(clampDate(from, minDate, maxDate)),
						to: toDateInputValue(to),
					};
				},
			},
		],
		[min, max, minDate, maxDate],
	);

	const activePreset = useMemo(() => {
		return presets.find((preset) => {
			const range = preset.getRange();
			return range.from === from && range.to === to;
		});
	}, [presets, from, to]);

	const applyRange = (next: { from?: DateValue; to?: DateValue }) => {
		const fromDate = next.from
			? clampDate(parseDateInput(next.from), minDate, maxDate)
			: undefined;
		let toDate = next.to ? clampDate(parseDateInput(next.to), minDate, maxDate) : undefined;

		if (fromDate && toDate && fromDate > toDate) {
			toDate = fromDate;
		}

		onChange({
			from: fromDate ? toDateInputValue(fromDate) : undefined,
			to: toDate ? toDateInputValue(toDate) : undefined,
		});
	};

	const handlePresetClick = (preset: DatePreset) => {
		applyRange(preset.getRange());
	};

	const displayValue = useMemo(() => {
		if (!from && !to) return 'All time';
		if (from === min && to === max) return 'All time';

		const fromDate = from ? parseDateInput(from) : undefined;
		const toDate = to ? parseDateInput(to) : undefined;

		if (fromDate && toDate && isSameDay(fromDate, toDate)) {
			return formatDisplayDate(fromDate);
		}

		const fromLabel = fromDate ? formatDisplayDate(fromDate) : '...';
		const toLabel = toDate ? formatDisplayDate(toDate) : '...';

		return `${fromLabel} - ${toLabel}`;
	}, [from, to, min, max]);

	return (
		<div className='space-y-3'>
			<div className='flex flex-wrap gap-2'>
				{presets.map((preset) => (
					<button
						key={preset.label}
						type='button'
						onClick={() => handlePresetClick(preset)}
						className={cn(
							'rounded-md border px-2 py-1 text-xs transition-colors',
							activePreset?.label === preset.label
								? 'bg-ctp-blue border-ctp-blue text-white'
								: 'bg-ctp-surface0 border-ctp-surface1 text-ctp-text hover:bg-ctp-surface1',
						)}
					>
						{preset.label}
					</button>
				))}
			</div>

			<div className='grid gap-2'>
				<div className='space-y-1'>
					<label
						htmlFor='date-from'
						className='text-ctp-subtext1 block text-xs font-medium'
					>
						From
					</label>
					<input
						id='date-from'
						type='date'
						value={from ?? ''}
						min={min}
						max={to ?? max}
						onChange={(e) => applyRange({ from: e.target.value || undefined, to })}
						className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text focus:border-ctp-blue focus:ring-ctp-blue/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none'
					/>
				</div>

				<div className='space-y-1'>
					<label
						htmlFor='date-to'
						className='text-ctp-subtext1 block text-xs font-medium'
					>
						To
					</label>
					<input
						id='date-to'
						type='date'
						value={to ?? ''}
						min={from ?? min}
						max={max}
						onChange={(e) => applyRange({ from, to: e.target.value || undefined })}
						className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text focus:border-ctp-blue focus:ring-ctp-blue/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none'
					/>
				</div>
			</div>

			<div className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text rounded-md border px-3 py-2 text-sm'>
				{displayValue}
			</div>
		</div>
	);
};
