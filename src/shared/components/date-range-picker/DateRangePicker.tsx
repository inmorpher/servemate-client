import { FilterDateRange } from '../filter/ui/FilterDateRange';
import { parseDateInput, toDateInputValue } from '../filter/ui/date-helpers';

interface DateRangePickerProps {
	dates?: {
		startDate: string;
		endDate: string;
	};
	onRangeChange: (range: { startDate: Date | undefined; endDate: Date | undefined }) => void;
}

const toDateValue = (value: string | undefined) => {
	if (!value) return undefined;
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : toDateInputValue(date);
};

export const DateRangePicker = ({ dates, onRangeChange }: DateRangePickerProps) => {
	return (
		<FilterDateRange
			from={toDateValue(dates?.startDate)}
			to={toDateValue(dates?.endDate)}
			onChange={(range) =>
				onRangeChange({
					startDate: range.from ? parseDateInput(range.from) : undefined,
					endDate: range.to ? parseDateInput(range.to) : undefined,
				})
			}
		/>
	);
};
