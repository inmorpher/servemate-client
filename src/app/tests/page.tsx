'use client';

import { DatePickerField } from '@/shared/components/date-picker-field/DatePickerField';
import { useState } from 'react';

export default function DatePickerPage() {
	const [filters, setFilters] = useState({
		fromDate: '2026-01-10T00:00:00Z',
		toDate: '2026-01-18T00:00:00Z',
	});
	const [openFrom, setOpenFrom] = useState(false);
	const [openTo, setOpenTo] = useState(false);
	const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
		from: new Date('2026-01-10'),
		to: new Date('2026-01-18'),
	});

	const handleDateChange = (date: Date | undefined, type: 'from' | 'to') => {
		if (!date || !(date instanceof Date)) {
			alert('Invalid date selected');
			return;
		}

		if (type === 'from') {
			setDateRange((prev) => ({
				...prev,
				from: date,
			}));
		}

		if (type === 'to') {
			setDateRange((prev) => ({
				...prev,
				to: date,
			}));
		}

		setOpenFrom(false);
		setOpenTo(false);
	};

	const disabledDates = (date: Date): boolean => {
		const { fromDate, toDate } = filters;
		return (fromDate && date < new Date(fromDate)) || (toDate && date > new Date()) || false;
	};

	// const calendarStyles: Partial<ClassNames> = {
	// 	// Main container

	// 	months: ' flex-col gap-4',
	// 	month: 'w-full',
	// 	nav: ' justify-between',
	// 	button_previous: 'text-ctp-text  rounded-md p-1',
	// 	button_next: 'text-ctp-text h rounded-md p-1',
	// 	month_caption: ' justify-center items-center text-ctp-text font-semibold py-2',
	// 	dropdowns: 'flex justify-center items-center gap-2',

	// 	// Table
	// 	month_grid: 'w-full border-collapse',
	// 	weekdays: 'flex gap-1 ',
	// 	weekday: 'h-9 w-9 p-0 font-bold text-ctp-blue  rounded-md transition-colors cursor-pointer',
	// 	week: 'flex gap-1 justify-center',
	// 	focused: 'ring-1 ring-ctp-blue bg-ctp-sky',
	// 	// Day

	// 	day: 'h-9 w-9 p-0 font-normal text-ctp-text bg-transparent rounded-md transition-colors cursor-pointer',

	// 	outside: 'text-ctp-subtext0/40 opacity-50',

	// 	disabled: 'text-white/30 cursor-not-allowed ',

	// 	week_number: 'text-ctp-subtext0 text-xs',
	// 	week_number_header: 'text-ctp-subtext0 text-xs',

	// 	selected: 'font-semibold rounded-md bg-ctp-blue text-ctp-red selected:text-red-500',
	// 	today: ' rounded-2xl border-ctp-white border-[0.5px]',
	// };

	return (
		<div className='bg-ctp-base text-ctp-text min-h-screen p-8'>
			<div className='max-w-md'>
				<div className='space-y-6'>
					<div>
						<label className='text-ctp-subtext0 mb-2 block text-sm font-medium'>
							From Date
						</label>
						<DatePickerField
							label={'From Date'}
							value={dateRange.from}
							onChange={(date) => handleDateChange(date, 'from')}
							disabled={disabledDates}
						/>
					</div>
					<div>
						<label className='text-ctp-subtext0 mb-2 block text-sm font-medium'>
							To Date
						</label>
						<DatePickerField
							label={'To Date'}
							value={dateRange.to}
							onChange={(date) => handleDateChange(date, 'to')}
							disabled={disabledDates}
						/>
					</div>
				</div>
			</div>

			<div className='bg-ctp-surface0 mt-8 rounded-md p-4'>
				<h2 className='text-ctp-blue mb-2 text-sm font-medium'>Selected Range</h2>
				<p className='text-ctp-subtext0 text-sm'>
					From:{' '}
					<span className='text-ctp-text'>{dateRange.from?.toLocaleDateString()}</span>
				</p>
				<p className='text-ctp-subtext0 text-sm'>
					To: <span className='text-ctp-text'>{dateRange.to?.toLocaleDateString()}</span>
				</p>
			</div>
		</div>
	);
}
