import { cn } from '@/shared/utils/classNames';
import { TableHeadProps } from '../types';

export const TableHead = ({ className, ref, children, ...props }: TableHeadProps) => {
	return (
		<thead
			ref={ref}
			className={cn('bg-ctp-surfave1/60 border-ctp-surface1 border-b', className)}
			{...props}
		>
			{children}
		</thead>
	);
};
