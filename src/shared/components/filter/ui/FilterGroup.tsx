import { cn } from '@/shared/utils/classNames';
import { ReactNode } from 'react';

interface FilterGroupProps {
	label: string;
	children: ReactNode;
	className?: string;
	required?: boolean;
	description?: string;
}

/**
 * Renders a group of filter controls with a label, optional description, and required indicator.
 *
 * @param props - The props for the FilterGroup component.
 * @param props.label - The label displayed above the filter group.
 * @param props.children - The filter controls or elements to be grouped.
 * @param props.className - Optional additional class names for the container.
 * @param props.required - Whether the filter group is required. Displays an asterisk if true.
 * @param props.description - Optional description text displayed below the label.
 *
 * @returns A styled container grouping filter controls with label and description.
 */
export const FilterGroup = ({
	label,
	children,
	className,
	required = false,
	description,
}: FilterGroupProps) => {
	return (
		<div className={cn('space-y-2', className)}>
			<div className='space-y-1'>
				<label className='text-ctp-subtext1 block text-sm font-medium'>
					{label}
					{required && <span className='text-ctp-red'>*</span>}
				</label>
				{description && <p className='text-ctp-subtext2 text-xs'>{description}</p>}
			</div>
			<div className='flex flex-wrap gap-2 p-2'>{children}</div>
		</div>
	);
};
