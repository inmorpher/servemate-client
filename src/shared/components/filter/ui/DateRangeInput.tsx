'use client';

import { cn } from '@/shared/utils/classNames';
import { DateInput } from './DateInput';

interface DateRangeInputProps {
	fromDate?: string;
	toDate?: string;
	onFromDateChange: (date: string) => void;
	onToDateChange: (date: string) => void;
	minDate?: string;
	maxDate?: string;
	className?: string;
}

/**
 * A date range selector component with two date inputs (from and to).
 * Used in filter panels to select order date ranges.
 *
 * @param props - The props for the DateRangeInput component.
 * @param props.fromDate - The start date (ISO format).
 * @param props.toDate - The end date (ISO format).
 * @param props.onFromDateChange - Callback when start date changes.
 * @param props.onToDateChange - Callback when end date changes.
 * @param props.minDate - Minimum available date (ISO format).
 * @param props.maxDate - Maximum available date (ISO format).
 * @param props.className - Additional CSS classes.
 *
 * @returns A date range selector component.
 */
export const DateRangeInput = ({
	fromDate,
	toDate,
	onFromDateChange,
	onToDateChange,
	minDate,
	maxDate,
	className,
}: DateRangeInputProps) => {
	return (
		<div className={cn('flex flex-wrap', className)}>
			<DateInput
				label='From'
				value={fromDate}
				onChange={onFromDateChange}
				placeholder='Start date'
				min={minDate}
				max={toDate || maxDate}
				className='text-sm'
			/>
			<DateInput
				label='To'
				value={toDate}
				onChange={onToDateChange}
				placeholder='End date'
				min={fromDate || minDate}
				max={maxDate}
				className='text-sm'
			/>
		</div>
	);
};
