import { cn } from '@/shared/utils/classNames';
import { TableRowProps } from '../types';

export const TableRow = ({ className, isSelected, ref, ...props }: TableRowProps) => {
	return (
		<tr
			ref={ref}
			className={cn(
				'border-ctp-surface1 hover:bg-ctp-surface1/40 divide-x border-b transition-colors',
				isSelected && 'bg-ctp-surface1/60',
				className,
			)}
			{...props}
		/>
	);
};
