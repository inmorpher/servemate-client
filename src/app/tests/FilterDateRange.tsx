'use client';

type DateValue = string | undefined;

interface FilterDateRangeProps {
	from: DateValue;
	to: DateValue;
	min?: DateValue;
	max?: DateValue;
	onChange: (range: { from: DateValue; to: DateValue }) => void;
}

interface DatePreset {
	label: string;
	getRange: () => { from: DateValue; to: DateValue };
}

export const FilterDateRange = ({ from, to, min, max, onChange }: FilterDateRangeProps) => {
	const toDateInputValue = (date: Date): string => {
		return date.toISOString().split('T')[0];
	};

	const parseDateInput = (value: string): Date | undefined => {
		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? undefined : parsed;
	};

	const clampDate = (date: Date, min?: Date, max?: Date): Date => {
		if (min && date < min) return min;
		if (max && date > max) return max;
		return date;
	};
	const minDate = min ? parseDateInput(min) : undefined;
	const maxDate = max ? parseDateInput(max) : undefined;

	const presets: DatePreset[] = [
		{
			label: 'Todat',
			getRange: () => {
				const today = new Date();
				const value = toDateInputValue(today);
				return { from: value, to: value };
			},
		},
		{
			label: 'Last 7 days',
			getRange: () => {
				const to = new Date();
				const from = new Date(to);
				from.setDate(to.getDate() - 6);
				return {
					from: toDateInputValue(from),
					to: toDateInputValue(to),
				};
			},
		},
		{
			label: 'This month',
			getRange: () => {
				const to = new Date();
				const from = new Date(to.getFullYear(), to.getMonth(), 1);
				return {
					from: toDateInputValue(from),
					to: toDateInputValue(to),
				};
			},
		},
	];

	const applyRange = (next: { from: DateValue; to: DateValue }) => {
		let nextFrom = next.from;
		let nextTo = next.to;

		// Parse and clamp
		let fromDate = nextFrom ? parseDateInput(nextFrom) : undefined;
		let toDate = nextTo ? parseDateInput(nextTo) : undefined;

		if (fromDate) {
			fromDate = clampDate(fromDate, minDate, maxDate);
		}

		if (toDate) {
			toDate = clampDate(toDate, minDate, maxDate);
		}

		// Ensure from <= to
		if (fromDate && toDate && fromDate > toDate) {
			toDate = fromDate;
		}

		onChange({
			from: fromDate ? toDateInputValue(fromDate) : undefined,
			to: toDate ? toDateInputValue(toDate) : undefined,
		});
	};

	const handleFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		applyRange({ from: event.target.value || undefined, to });
	};

	const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		applyRange({ from, to: event.target.value || undefined });
	};

	const handlePresetClick = (preset: DatePreset) => {
		applyRange(preset.getRange());
	};

	return (
		<div className='space-y-3'>
			<div className='flex flex-wrap gap-2'>
				{presets.map((preset) => (
					<button
						key={preset.label}
						className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text w-full rounded-lg border px-3 py-2 text-sm'
						onClick={() => handlePresetClick(preset)}
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
						onChange={handleFromChange}
						className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text w-full rounded-lg border px-3 py-2 text-sm'
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
						onChange={handleToChange}
						className='bg-ctp-surface0 border-ctp-surface1 text-ctp-text w-full rounded-lg border px-3 py-2 text-sm'
					/>
				</div>
			</div>
		</div>
	);
};
