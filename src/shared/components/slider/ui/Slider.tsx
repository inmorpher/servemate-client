
'use client';
import Slider, { SliderProps } from 'rc-slider';
import 'rc-slider/assets/index.css';

const AppSlider = (props: SliderProps) => (
  <Slider
    {...props}
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
