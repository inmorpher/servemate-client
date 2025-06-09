import { cn } from '@/shared/utils/classNames';
import { FC } from 'react';

const bgColors = {
	info: 'bg-ctp-blue',
	success: 'bg-ctp-green',
	error: 'bg-ctp-red',
	warn: 'bg-ctp-yellow',
};

const textColors = {
	info: 'text-white',
	success: 'text-ctp-base',
	error: 'text-white',
	warn: 'text-gray-900',
};

interface ToastProps {
	message: string;
	type: 'info' | 'success' | 'error' | 'warn';
	isClosing: boolean;
	index: number;
	onClose: () => void;
}

const Toast: FC<ToastProps> = ({ message, type, index, onClose, isClosing }) => {
	return (
		<div
			id={`toast-${index}`}
			role='alert'
			aria-live='polite'
			className={cn(
				'fixed right-4 py-2 px-4 rounded-lg shadow-lg min-w-[280px] max-w-[320px] flex justify-between items-center transform transition-all duration-150',
				isClosing ? 'animate-fadeOut' : 'animate-fadeIn',
				bgColors[type],
				textColors[type]
			)}
			style={{ top: `${20 + index * 70}px` }}
		>
			<span className='pr-4'>{message}</span>
			<button className='text-xl font-bold hover:opacity-70 transition-opacity' onClick={onClose}>
				×
			</button>
		</div>
	);
};

export default Toast;
