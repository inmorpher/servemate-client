import { useState } from 'react';
import { DatePickerField } from '../date-picker-field/DatePickerField';

interface DateRangePickerProps {
	dates?: {
		startDate: string;
		endDate: string;
	};
	onRangeChange: (range: { startDate: Date | undefined; endDate: Date | undefined }) => void;
}

export const DateRangePicker = ({ dates, onRangeChange }: DateRangePickerProps) => {
	const [filterDates, setFilterDates] = useState<{
		startDate: Date | undefined;
		endDate: Date | undefined;
	}>({
		startDate: dates?.startDate ? new Date(dates.startDate) : undefined,
		endDate: dates?.endDate ? new Date(dates.endDate) : undefined,
	});

	const handleStartDateChange = (date: Date | undefined) => {
		setFilterDates((prev) => ({ ...prev, startDate: date }));
		onRangeChange({ startDate: date, endDate: filterDates.endDate });
	};

	const handleEndDateChange = (date: Date | undefined) => {
		setFilterDates((prev) => ({ ...prev, endDate: date }));
		onRangeChange({ startDate: filterDates.startDate, endDate: date });
	};

	return (
		<div className='flex gap-1'>
			{/**Start date */}
			<DatePickerField
				label='Start Date'
				value={filterDates.startDate}
				onChange={handleStartDateChange}
				disabled={{
					before: dates?.startDate ? new Date(dates.startDate) : undefined,
					after: filterDates.endDate || new Date(),
				}}
			/>
			{/**End date */}
			<DatePickerField
				label='End Date'
				value={filterDates.endDate}
				onChange={handleEndDateChange}
				disabled={{ before: filterDates.startDate, after: new Date() }}
			/>
		</div>
	);
};
