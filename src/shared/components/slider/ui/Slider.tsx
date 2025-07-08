'use client';
import Slider, { SliderProps } from 'rc-slider';
import 'rc-slider/assets/index.css';

/**
 * A customized slider component that wraps the base `Slider` and applies consistent styling and step value.
 *
 * @param props - The properties to pass to the underlying `Slider` component.
 * @returns A styled slider component with predefined colors and a step of 0.01.
 */
const AppSlider = (props: SliderProps) => (
	<Slider
		{...props}
		step={0.01}
		styles={{
			rail: { backgroundColor: '#45475a' },
			track: { backgroundColor: '#89b4fa' },
			handle: {
				backgroundColor: '#89b4fa',
				borderColor: '#89b4fa',
				opacity: 1,
			},
		}}
	/>
);

export default AppSlider;
