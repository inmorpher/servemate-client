'use client';

import { Button } from '@/shared/components/button';
import { Calendar, calendarStyles } from '@/shared/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { cn } from '@/shared/utils/classNames';
import { isSameDay } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import {
	clampDate,
	formatDisplayDate,
	getStartOfToday,
	normalizeDateInput,
	parseDateInput,
	toDateInputValue,
} from './date-helpers';

export type DateValue = string | undefined;

export interface DateRangeValue {
	from?: DateValue;
	to?: DateValue;
}

interface FilterDateRangeProps {
	from?: DateValue;
	to?: DateValue;
	min?: DateValue;
	max?: DateValue;
	onChange: (range: DateRangeValue) => void;
}

interface DatePreset {
	label: string;
	getRange: () => { from?: DateValue; to?: DateValue };
}

// --- UTC-safe helpers: treat YYYY-MM-DD as literal calendar date ---

export const FilterDateRange = ({ from, to, min, max, onChange }: FilterDateRangeProps) => {
	const [open, setOpen] = useState(false);
	const normalizedFrom = normalizeDateInput(from);
	const normalizedTo = normalizeDateInput(to);
	const normalizedMin = normalizeDateInput(min);
	const normalizedMax = normalizeDateInput(max);
	const [draftRange, setDraftRange] = useState<DateRangeValue>({
		from: normalizedFrom,
		to: normalizedTo,
	});
	const inputId = useId();
	const minDate = useMemo(
		() => (normalizedMin ? parseDateInput(normalizedMin) : undefined),
		[normalizedMin],
	);
	const maxDate = useMemo(
		() => (normalizedMax ? parseDateInput(normalizedMax) : undefined),
		[normalizedMax],
	);

	const presets: DatePreset[] = useMemo(
		() => [
			{
				label: 'All time',
				getRange: () => ({ from: undefined, to: undefined }),
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
				label: 'This month',
				getRange: () => {
					const to = clampDate(getStartOfToday(), minDate, maxDate);
					const from = new Date(to.getFullYear(), to.getMonth(), 1);
					return {
						from: toDateInputValue(clampDate(from, minDate, maxDate)),
						to: toDateInputValue(to),
					};
				},
			},
		],
		[minDate, maxDate],
	);

	const activePreset = useMemo(() => {
		return presets.find((preset) => {
			const range = preset.getRange();
			return range.from === normalizedFrom && range.to === normalizedTo;
		});
	}, [presets, normalizedFrom, normalizedTo]);

	const selectedRange = useMemo<DateRange | undefined>(() => {
		if (!draftRange.from && !draftRange.to) return undefined;

		return {
			from: draftRange.from ? parseDateInput(draftRange.from) : undefined,
			to: draftRange.to ? parseDateInput(draftRange.to) : undefined,
		};
	}, [draftRange.from, draftRange.to]);

	const disabledDates = useMemo(() => {
		if (minDate && maxDate) return { before: minDate, after: maxDate };
		if (minDate) return { before: minDate };
		if (maxDate) return { after: maxDate };
		return undefined;
	}, [minDate, maxDate]);

	const normalizeRange = (next: DateRangeValue): DateRangeValue => {
		const fromDate = next.from
			? clampDate(parseDateInput(next.from), minDate, maxDate)
			: undefined;
		let toDate = next.to ? clampDate(parseDateInput(next.to), minDate, maxDate) : undefined;

		if (fromDate && toDate && fromDate > toDate) {
			toDate = fromDate;
		}

		return {
			from: fromDate ? toDateInputValue(fromDate) : undefined,
			to: toDate ? toDateInputValue(toDate) : undefined,
		};
	};

	const commitRange = (next: DateRangeValue) => {
		onChange(normalizeRange(next));
		setOpen(false);
	};

	const handleCalendarSelect = (range: DateRange | undefined) => {
		setDraftRange({
			from: range?.from ? toDateInputValue(range.from) : undefined,
			to: range?.to ? toDateInputValue(range.to) : undefined,
		});
	};

	const handlePresetClick = (preset: DatePreset) => {
		commitRange(preset.getRange());
	};

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) setDraftRange({ from: normalizedFrom, to: normalizedTo });
		setOpen(nextOpen);
	};

	const displayValue = useMemo(() => {
		if (!normalizedFrom && !normalizedTo) return 'All time';
		if (normalizedFrom === normalizedMin && normalizedTo === normalizedMax) return 'All time';

		const fromDate = normalizedFrom ? parseDateInput(normalizedFrom) : undefined;
		const toDate = normalizedTo ? parseDateInput(normalizedTo) : undefined;

		if (fromDate && toDate && isSameDay(fromDate, toDate)) {
			return formatDisplayDate(fromDate);
		}
		if (fromDate && !toDate) return `From ${formatDisplayDate(fromDate)}`;
		if (!fromDate && toDate) return `To ${formatDisplayDate(toDate)}`;

		const fromLabel = fromDate ? formatDisplayDate(fromDate) : 'Start';
		const toLabel = toDate ? formatDisplayDate(toDate) : 'End';

		return `${fromLabel} - ${toLabel}`;
	}, [normalizedFrom, normalizedTo, normalizedMin, normalizedMax]);

	const defaultMonth = selectedRange?.from ?? selectedRange?.to ?? minDate ?? getStartOfToday();

	return (
		<div className='space-y-3'>
			<div className='flex flex-wrap gap-2'>
				{presets.map((preset) => (
					<button
						key={preset.label}
						type='button'
						onClick={() => handlePresetClick(preset)}
						aria-pressed={activePreset?.label === preset.label}
						className={cn(
							'rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
							activePreset?.label === preset.label
								? 'border-ctp-blue bg-ctp-blue text-ctp-crust'
								: 'border-ctp-surface1 bg-ctp-surface0/70 text-ctp-subtext1 hover:border-ctp-blue/60 hover:bg-ctp-surface1 hover:text-ctp-text',
						)}
					>
						{preset.label}
					</button>
				))}
			</div>

			<Popover modal open={open} onOpenChange={handleOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						size='sm'
						className='w-full justify-between font-normal'
						aria-haspopup='dialog'
						aria-expanded={open}
					>
						<span className='truncate'>{displayValue}</span>
						<ChevronDownIcon className='h-4 w-4 shrink-0' />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className='border-ctp-surface1 bg-ctp-mantle text-ctp-text z-60 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-96 overflow-x-hidden overflow-y-auto rounded-lg p-0 shadow-2xl max-sm:top-1/2! max-sm:left-1/2! sm:w-80 sm:max-w-none'
					align='center'
					collisionPadding={12}
				>
					<div className='border-ctp-surface1 bg-ctp-surface0/60 grid grid-cols-2 gap-2 border-b p-3'>
						<label className='text-ctp-subtext1 text-xs font-medium'>
							From
							<input
								id={`${inputId}-from`}
								type='text'
								value={
									draftRange.from
										? formatDisplayDate(parseDateInput(draftRange.from))
										: ''
								}
								placeholder='DD.MM.YYYY'
								readOnly
								inputMode='none'
								aria-label='From date'
								className='bg-ctp-base border-ctp-surface1 text-ctp-text focus:border-ctp-blue mt-1 block w-full rounded-md border px-2 py-1.5 text-xs font-normal focus:outline-none'
							/>
						</label>
						<label className='text-ctp-subtext1 text-xs font-medium'>
							To
							<input
								id={`${inputId}-to`}
								type='text'
								value={
									draftRange.to
										? formatDisplayDate(parseDateInput(draftRange.to))
										: ''
								}
								placeholder='DD.MM.YYYY'
								readOnly
								inputMode='none'
								aria-label='To date'
								className='bg-ctp-base border-ctp-surface1 text-ctp-text focus:border-ctp-blue mt-1 block w-full rounded-md border px-2 py-1.5 text-xs font-normal focus:outline-none'
							/>
						</label>
					</div>
					<Calendar
						mode='range'
						selected={selectedRange}
						defaultMonth={defaultMonth}
						showOutsideDays
						captionLayout='dropdown'
						className='bg-ctp-mantle w-full p-3'
						classNames={calendarStyles}
						disabled={disabledDates}
						onSelect={handleCalendarSelect}
					/>
					<div className='border-ctp-surface1 bg-ctp-surface0/40 flex items-center justify-between gap-2 border-t p-3'>
						<Button
							variant='ghost'
							size='xs'
							className='text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text'
							onClick={() => commitRange({ from: undefined, to: undefined })}
						>
							Clear
						</Button>
						<Button
							variant='unstyled'
							size='xs'
							className='bg-ctp-blue text-ctp-crust hover:bg-ctp-sapphire'
							disabled={Boolean(
								(!draftRange.from && draftRange.to) ||
								(draftRange.from && !draftRange.to),
							)}
							onClick={() => commitRange(draftRange)}
						>
							Apply
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};
