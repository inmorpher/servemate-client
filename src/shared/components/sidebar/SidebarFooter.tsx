import { cn } from '@/shared/utils/classNames';
import { FC } from 'react';
import { ISidebarFooterProps } from './types';

const SidebarFooter: FC<ISidebarFooterProps> = ({ children, className }) => {
	return (
		<div
			className={cn(
				'text-1 flex items-center justify-center w-full h-16 border-t border-ctp-surface0',
				className
			)}
		>
			{children}
			<p className='text-sm text-ctp-mauve'>© 2023 ServeMate</p>
		</div>
	);
};

export default SidebarFooter;
