import { ClassNames } from 'react-day-picker';

export const calendarStyles: Partial<ClassNames> = {
	// Main container

	months: ' flex-col gap-4',
	month: 'w-full',
	nav: ' justify-between',
	button_previous: 'text-ctp-text  rounded-md p-1',
	button_next: 'text-ctp-text h rounded-md p-1',
	month_caption: ' justify-center items-center text-ctp-text font-semibold py-2',
	dropdowns: 'flex justify-center items-center gap-2',

	// Table
	month_grid: 'w-full border-collapse',
	weekdays: 'flex gap-1 ',
	weekday: 'h-9 w-9 p-0 font-bold text-ctp-blue  rounded-md transition-colors cursor-pointer',
	week: 'flex gap-1 justify-center',
	focused: 'ring-1 ring-ctp-blue bg-ctp-sky',
	// Day

	day: 'h-9 w-9 p-0 font-normal text-ctp-text bg-transparent rounded-md transition-colors cursor-pointer',

	outside: 'text-ctp-subtext0/40 opacity-50',

	disabled: 'text-white/30 cursor-not-allowed ',

	week_number: 'text-ctp-subtext0 text-xs',
	week_number_header: 'text-ctp-subtext0 text-xs',

	selected: 'font-semibold rounded-md bg-ctp-blue text-ctp-red selected:text-red-500',
	today: ' rounded-2xl border-ctp-white border-[0.5px]',
};
