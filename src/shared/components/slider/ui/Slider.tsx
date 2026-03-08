'use client';
import { cn } from '@/shared/lib/classNames';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';

interface RangeSlider {
	debounce?: boolean;
	handler?: (values: number[]) => void;
	minValue?: number;
	maxValue?: number;
	inputs?: boolean;
	step?: number;
	defaultValue?: number[];
}

/**
 * RangeSlider is a React component that renders a customizable range slider with optional input controls.
 *
 * @param {boolean} [debounce=true] - If true, the handler function is debounced by 300ms when the slider value changes.
 * @param {number} minValue - The minimum value of the slider range.
 * @param {number} maxValue - The maximum value of the slider range.
 * @param {number} [step=0.1] - The step increment for the slider and input controls.
 * @param {(value: number[]) => void} [handler] - Callback function invoked when the slider value changes. Receives the current value range as an array.
 * @param {boolean} [inputs=true] - If true, renders input controls for manual value entry and increment/decrement buttons.
 * @param {number[]} [defaultValue] - Initial value for the slider range.
 *
 * @returns {JSX.Element} The rendered range slider component with optional input controls.
 */
const RangeSlider = ({
	debounce = true,
	minValue = 0,
	maxValue = 100,
	step = 1,
	handler,
	inputs = true,
	defaultValue,
}: RangeSlider) => {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [valueRange, setValueRange] = useState([minValue, maxValue]);

	const callHandler = (values: number[]) => {
		if (!handler) return;

		if (debounce) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				handler(values);
				timeoutRef.current = null;
			}, 300);
		} else {
			handler(values);
		}
	};

	const handleInputChange = (index: 0 | 1, newValue: number) => {
		setValueRange((currentRange) => {
			let newRange: number[];
			if (index === 0) {
				if (newValue >= minValue && newValue <= currentRange[1]) {
					newRange = [newValue, currentRange[1]];
					callHandler(newRange);
					return newRange;
				}
			} else {
				if (newValue <= maxValue && newValue >= currentRange[0]) {
					newRange = [currentRange[0], newValue];
					callHandler(newRange);
					return newRange;
				}
			}
			return currentRange;
		});
	};

	const handleSliderChange = (value: number | number[]) => {
		const newRange = value as number[];
		setValueRange(newRange);
		callHandler(newRange);
	};

	// useEffect(() => {
	// 	setValueRange([minValue, maxValue]);
	// }, [minValue, maxValue]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<>
			<Slider
				range
				value={valueRange}
				onChange={handleSliderChange}
				min={defaultValue ? defaultValue[0] : minValue}
				max={defaultValue ? defaultValue[1] : maxValue}
				step={step}
				styles={{
					rail: { backgroundColor: 'var(--ctp-surface1)' },
					track: { backgroundColor: 'var(--ctp-blue)' },
					handle: {
						backgroundColor: 'var(--ctp-blue)',
						borderColor: 'var(--ctp-blue)',
						opacity: 1,
					},
				}}
			/>
			{inputs && (
				<div className='mt-2 flex items-center justify-between'>
					<input
						disabled={false}
						type='number'
						step={step}
						value={valueRange[0]}
						onChange={(e) => {
							const newMin = Number(e.target.value);
							handleInputChange(0, newMin);
						}}
						className={cn(
							'bg-ctp-surface0 text-ctp-text border-ctp-overlay0 w-20 rounded border p-1 text-center',
						)}
						min={minValue}
						max={valueRange[1]}
						aria-label='Minimal value'
					/>

					<span className='mx-2 text-gray-500'>-</span>

					<input
						disabled={false}
						type='number'
						value={valueRange[1]}
						step={step}
						onChange={(e) => {
							const newMax = Number(e.target.value);
							handleInputChange(1, newMax);
						}}
						className={cn(
							'bg-ctp-surface0 text-ctp-text border-ctp-overlay0 w-20 rounded border p-1 text-center',
						)}
						min={valueRange[0]}
						max={maxValue}
						aria-label='Maximal value'
					/>
				</div>
			)}
		</>
	);
};

export default RangeSlider;
