import { ClassNames } from 'react-day-picker';

export const calendarStyles: Partial<ClassNames> = {
	root: 'text-ctp-text',
	months: 'flex-col gap-3',
	month: 'w-full',
	nav: 'justify-between px-1',
	button_previous: 'text-ctp-subtext1 rounded-md p-1 hover:bg-ctp-surface1 hover:text-ctp-text',
	button_next: 'text-ctp-subtext1 rounded-md p-1 hover:bg-ctp-surface1 hover:text-ctp-text',
	month_caption: 'justify-center items-center text-ctp-text font-semibold',
	dropdowns: 'flex justify-center items-center gap-1.5',
	dropdown_root: 'relative overflow-hidden rounded-md border border-ctp-surface1 bg-ctp-surface0',
	dropdown: 'absolute inset-0 cursor-pointer opacity-0',
	caption_label: 'text-ctp-text flex items-center gap-1 px-2 text-xs font-medium',
	month_grid: 'w-full border-collapse',
	weekdays: 'flex',
	weekday: 'h-8 w-9 p-0 text-ctp-subtext0 rounded-md text-[0.7rem] font-medium uppercase',
	week: 'mt-1 flex justify-center',
	focused: 'ring-2 ring-ctp-blue/50',
	day: 'h-9 w-9 p-0 font-normal text-ctp-text bg-transparent rounded-md transition-colors',

	outside: 'text-ctp-overlay0 opacity-70',

	disabled: 'text-ctp-overlay0 cursor-not-allowed opacity-50',

	week_number: 'text-ctp-subtext0 text-xs',
	week_number_header: 'text-ctp-subtext0 text-xs',

	range_start: 'bg-ctp-blue/20 rounded-l-md',
	range_middle: 'bg-ctp-blue/20 rounded-none',
	range_end: 'bg-ctp-blue/20 rounded-r-md',
	selected: 'font-semibold',
	today: 'rounded-md border border-ctp-blue',
};
