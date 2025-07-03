import { cn } from '@/shared/lib/classNames';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ChipProps {
	children: ReactNode;
	onRemove?: () => void;
	variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
	className?: string;
}

/**
 * Renders a customizable chip component with optional remove functionality.
 *
 * @remarks
 * The `SearchChip` component displays its children inside a styled container,
 * supporting different visual variants such as 'default', 'secondary', 'success', 'warning', and 'danger'.
 * If an `onRemove` callback is provided, a remove button is rendered, allowing the chip to be dismissed.
 *
 * @param children - The content to display inside the chip.
 * @param onRemove - Optional callback invoked when the remove button is clicked.
 * @param variant - The visual style of the chip. Can be 'default', 'secondary', 'success', 'warning', or 'danger'. Defaults to 'default'.
 * @param className - Additional CSS classes to apply to the chip container.
 *
 * @example
 * ```tsx
 * <SearchChip variant="success" onRemove={() => alert('Removed!')}>
 *   Active Filter
 * </SearchChip>
 * ```
 */
export const SearchChip = ({ children, onRemove, variant = 'default', className }: ChipProps) => {
	return (
		<div
			className={cn(
				'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer hover:shadow-sm',
				variant === 'default' &&
					'bg-ctp-blue/10 text-ctp-blue border border-ctp-blue/20 hover:bg-ctp-blue/15 hover:border-ctp-blue/30',
				variant === 'secondary' &&
					'bg-ctp-surface1 text-ctp-text border border-ctp-surface2 hover:bg-ctp-surface2 hover:border-ctp-overlay0',
				variant === 'success' &&
					'bg-ctp-green/10 text-ctp-green border border-ctp-green/20 hover:bg-ctp-green/15 hover:border-ctp-green/30',
				variant === 'warning' &&
					'bg-ctp-yellow/10 text-ctp-yellow border border-ctp-yellow/20 hover:bg-ctp-yellow/15 hover:border-ctp-yellow/30',
				variant === 'danger' &&
					'bg-ctp-red/10 text-ctp-red border border-ctp-red/20 hover:bg-ctp-red/15 hover:border-ctp-red/30',
				className
			)}
		>
			<span>{children}</span>
			{onRemove && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					className={cn(
						'p-0.5 rounded-full transition-all duration-200 hover:scale-110',
						variant === 'default' && 'hover:bg-ctp-blue/20 text-ctp-blue',
						variant === 'secondary' && 'hover:bg-ctp-overlay0 text-ctp-subtext1',
						variant === 'success' && 'hover:bg-ctp-green/20 text-ctp-green',
						variant === 'warning' && 'hover:bg-ctp-yellow/20 text-ctp-yellow',
						variant === 'danger' && 'hover:bg-ctp-red/20 text-ctp-red'
					)}
					aria-label='Remove'
				>
					<X size={14} />
				</button>
			)}
		</div>
	);
};
