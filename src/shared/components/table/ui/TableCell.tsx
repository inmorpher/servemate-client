import { cn } from '@/shared/utils/classNames';
import { TableCellProps } from '../types';

export const TableCell = ({
	className,
	isSelected,
	ref,
	truncate = true,
	align = 'justify',
	...props
}: TableCellProps) => {
	return (
		<td
			ref={ref}
			align={align}
			className={cn(
				'border-ctp-surface1 data-[active=true]:bg-ctp-surface1/40 px-4 py-3 align-middle font-semibold transition-colors',
				truncate && 'truncate',
				isSelected && 'bg-ctp-surface1/40',
				className,
			)}
			{...props}
		/>
	);
};
