import { cn } from '@/shared/utils/classNames';
import { ReactNode } from 'react';

interface FilterContainerProps {
	children: ReactNode;
	title?: string;
	className?: string;
}

/**
 * A container component for filter elements, typically used in sidebars or filter panels.
 *
 * @param {object} props - The props for the FilterContainer component.
 * @param {React.ReactNode} props.children - The filter elements or content to be displayed inside the container.
 * @param {string} [props.title] - Optional title to display at the top of the container.
 * @param {string} [props.className] - Additional CSS classes to apply to the container.
 *
 * @returns {JSX.Element} The rendered filter container component.
 */
export const FilterContainer = ({ children, title, className }: FilterContainerProps) => {
	return (
		<aside
			className={cn(
				'bg-ctp-base rounded-2xlc sticky top-[calc(3.5625rem+1.5rem)] h-fit max-h-[calc(100vh-3.5625rem-3rem)] w-100 shrink-0 self-start overflow-y-auto rounded-2xl p-2',
				className,
			)}
		>
			{title && <h3 className='text-lg font-semibold'>{title}</h3>}
			<div className='flex flex-col space-y-4'>{children}</div>
		</aside>
	);
};
