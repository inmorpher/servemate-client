'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/shared/utils/classNames';

interface PriceRangeFilterProps {
	minValue: number;
	maxValue: number;
	value: number[];
	onChange: (values: number[]) => void;
}

interface PricePreset {
	id: string;
	label: string;
	min: number;
	max: number;
}

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const clampValue = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const normalizeRange = (min: number, max: number, absoluteMin: number, absoluteMax: number) => {
	const safeMin = clampValue(min, absoluteMin, absoluteMax);
	const safeMax = clampValue(max, absoluteMin, absoluteMax);

	if (safeMin > safeMax) {
		return { min: safeMax, max: safeMin };
	}

	return { min: safeMin, max: safeMax };
};

const buildPresets = (absoluteMin: number, absoluteMax: number): PricePreset[] => {
	const presets: PricePreset[] = [];
	const firstUpper = 24.99;

	presets.push({
		id: '0-24.99',
		label: `${formatCurrency(absoluteMin)} – ${formatCurrency(Math.min(firstUpper, absoluteMax))}`,
		min: absoluteMin,
		max: Math.min(firstUpper, absoluteMax),
	});

	if (absoluteMax <= 24.99) {
		return presets;
	}

	let currentStart = 25;

	while (currentStart < absoluteMax) {
		const upper = currentStart * 2 - 0.01;
		const end = Math.min(upper, absoluteMax);
		const isLast = end >= absoluteMax;

		if (isLast) {
			const step = absoluteMax < 200 ? 50 : 100;
			const lastStart = Math.max(currentStart, Math.floor(absoluteMax / step) * step);

			if (lastStart > currentStart) {
				presets.push({
					id: `${lastStart}+`,
					label: `${formatCurrency(lastStart)} and up`,
					min: lastStart,
					max: absoluteMax,
				});
			} else {
				presets.push({
					id: `${currentStart}+`,
					label: `${formatCurrency(currentStart)} and up`,
					min: currentStart,
					max: absoluteMax,
				});
			}
			break;
		}

		presets.push({
			id: `${currentStart}-${end.toFixed(2)}`,
			label: `${formatCurrency(currentStart)} – ${formatCurrency(end)}`,
			min: currentStart,
			max: end,
		});

		currentStart *= 2;
	}

	return presets;
};

export const PriceRangeFilter = ({ minValue, maxValue, value, onChange }: PriceRangeFilterProps) => {
	const [selectedPreset, setSelectedPreset] = useState('');
	const presets = useMemo(() => buildPresets(minValue, maxValue), [minValue, maxValue]);

	useEffect(() => {
		const matchedPreset = presets.find((preset) => preset.min === value[0] && preset.max === value[1]);
		setSelectedPreset(matchedPreset?.id ?? '');
	}, [presets, value]);

	const handlePresetChange = (presetId: string) => {
		const preset = presets.find((item) => item.id === presetId);
		if (!preset) {
			setSelectedPreset('');
			return;
		}

		setSelectedPreset(preset.id);
		onChange([preset.min, preset.max]);
	};

	const handleInputChange = (index: 0 | 1, rawValue: string) => {
		const parsedValue = Number(rawValue);
		if (Number.isNaN(parsedValue)) {
			return;
		}

		const nextValues = [...value];
		nextValues[index] = parsedValue;
		const { min, max } = normalizeRange(nextValues[0], nextValues[1], minValue, maxValue);
		onChange([min, max]);
	};

	return (
		<div className='space-y-3'>
			<label className='block text-sm text-ctp-subtext0'>
				<span className='mb-1 block text-xs'>Quick ranges</span>
				<select
					value={selectedPreset}
					onChange={(event) => handlePresetChange(event.target.value)}
					className={cn(
						'w-full rounded-md border border-ctp-surface1 bg-ctp-surface0 px-3 py-2 text-sm text-ctp-text focus:outline-none focus:ring-2 focus:ring-ctp-blue',
					)}
				>
					<option value=''>Custom</option>
					{presets.map((preset) => (
						<option key={preset.id} value={preset.id}>
							{preset.label}
						</option>
					))}
				</select>
			</label>

			<div className='flex items-center gap-2'>
				<label className='flex-1 text-xs text-ctp-subtext0'>
					<span className='mb-1 block'>Min</span>
					<input
						type='number'
						min={minValue}
						max={maxValue}
						step='0.01'
						value={value[0]}
						onChange={(event) => handleInputChange(0, event.target.value)}
						className={cn(
							'w-full rounded-md border border-ctp-surface1 bg-ctp-surface0 px-2 py-2 text-sm text-ctp-text focus:outline-none focus:ring-2 focus:ring-ctp-blue',
						)}
					/>
				</label>

				<span className='pt-5 text-ctp-subtext0'>–</span>

				<label className='flex-1 text-xs text-ctp-subtext0'>
					<span className='mb-1 block'>Max</span>
					<input
						type='number'
						min={minValue}
						max={maxValue}
						step='0.01'
						value={value[1]}
						onChange={(event) => handleInputChange(1, event.target.value)}
						className={cn(
							'w-full rounded-md border border-ctp-surface1 bg-ctp-surface0 px-2 py-2 text-sm text-ctp-text focus:outline-none focus:ring-2 focus:ring-ctp-blue',
						)}
					/>
				</label>
			</div>
		</div>
	);
};

export default PriceRangeFilter;
