import { cn } from '@/shared/utils/classNames';
import { TableProps } from '../types';

export const TableRoot = ({ children, className, ref, ...props }: TableProps) => {
	return (
		<table
			ref={ref}
			className={cn('text-ctp-text text-m w-full caption-bottom', className)}
			{...props}
		>
			{children}
		</table>
	);
};
