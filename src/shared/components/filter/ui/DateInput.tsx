'use client';

import { cn } from '@/shared/lib/classNames';

interface DateInputProps {
	label?: string;
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	min?: string;
	max?: string;
	className?: string;
}

/**
 * A styled date input component for filter selections.
 * Converts datetime strings to local date format for display.
 *
 * @param props - The props for the DateInput component.
 * @param props.label - Optional label for the input.
 * @param props.value - The current date value (ISO format).
 * @param props.onChange - Callback when date changes.
 * @param props.placeholder - Placeholder text.
 * @param props.disabled - Whether the input is disabled.
 * @param props.min - Minimum date (ISO format).
 * @param props.max - Maximum date (ISO format).
 * @param props.className - Additional CSS classes.
 *
 * @returns A styled date input component.
 */
export const DateInput = ({
	label,
	value,
	onChange,
	placeholder = 'Select date',
	disabled = false,
	min,
	max,
	className,
}: DateInputProps) => {
	// Convert ISO datetime to date format for input (YYYY-MM-DD)
	const getDateValue = () => {
		if (!value) return '';
		// Extract date part from ISO datetime string
		return value.split('T')[0];
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const dateValue = e.target.value;
		if (!dateValue) {
			onChange('');
			return;
		}
		// Convert back to ISO datetime format (00:00:00Z)
		onChange(`${dateValue}T00:00:00Z`);
	};

	// If min and max are the same date, expand them to allow a full range
	const getMinDate = () => {
		if (!min) return undefined;
		const minDateStr = min.split('T')[0];
		// If both min and max are the same, expand min to 30 days before
		if (max && min.split('T')[0] === max.split('T')[0]) {
			const minDate = new Date(min);
			const expandedMin = new Date(minDate.getTime() - 30 * 24 * 60 * 60 * 1000);
			return expandedMin.toISOString().split('T')[0];
		}
		return minDateStr;
	};

	const getMaxDate = () => {
		if (!max) return undefined;
		const maxDateStr = max.split('T')[0];
		// If both min and max are the same, expand max to 30 days after
		if (min && min.split('T')[0] === max.split('T')[0]) {
			const maxDate = new Date(max);
			const expandedMax = new Date(maxDate.getTime() + 30 * 24 * 60 * 60 * 1000);
			return expandedMax.toISOString().split('T')[0];
		}
		return maxDateStr;
	};

	return (
		<div className='w-full'>
			{label && (
				<label className='text-ctp-subtext1 mb-1 w-10 text-sm font-medium'>{label}</label>
			)}
			<div className='relative w-full'>
				<input
					type='date'
					value={getDateValue()}
					onChange={handleChange}
					min={getMinDate()}
					max={getMaxDate()}
					placeholder={placeholder}
					disabled={disabled}
					className={cn(
						'w-full rounded-lg px-3 py-2',
						'bg-ctp-surface0 text-ctp-text',
						'border-ctp-surface2 border',
						'focus:border-ctp-blue focus:ring-ctp-blue focus:ring-1 focus:outline-none',
						'placeholder:text-ctp-subtext2',
						'disabled:cursor-not-allowed disabled:opacity-50',
						'text-base',
						'relative z-50',
						className,
					)}
					style={{
						colorScheme: 'dark',
					}}
				/>
			</div>
		</div>
	);
};
