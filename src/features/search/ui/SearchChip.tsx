import { cn } from '@/shared/lib/classNames';
import { ReactNode, startTransition } from 'react';

interface ChipProps {
	children: ReactNode;
	onClick?: () => void;
	isActive?: boolean;
	variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
	className?: string;
}

/**
 * Renders a customizable chip component.
 *
 * @remarks
 * The `SearchChip` component displays its children inside a styled container,
 * supporting different visual variants. It can be either active or inactive,
 * determined by the `isActive` prop, which affects its appearance.
 * An `onClick` handler can be provided to respond to user interactions.
 *
 * @param children - The content to display inside the chip.
 * @param onClick - Optional callback invoked when the chip is clicked.
 * @param isActive - Determines if the chip is visually active. Defaults to false.
 * @param variant - The visual style of the chip.
 * @param className - Additional CSS classes to apply to the chip container.
 *
 * @example
 * ```tsx
 * <SearchChip
 *   variant="success"
 *   isActive={true}
 *   onClick={() => console.log('Chip clicked!')}
 * >
 *   Active Filter
 * </SearchChip>
 * ```
 */
export const SearchChip = ({
	children,
	onClick,
	isActive = false,
	variant = 'default',
	className,
}: ChipProps) => {
	const handleClick = () => {
		startTransition(() => {
			if (onClick) {
				onClick();
			}
		});
	};
	return (
		<div
			onClick={handleClick}
			className={cn(
				'inline-flex min-w-6 cursor-pointer items-center gap-2 rounded-lg px-1.5 py-0.5 text-center text-sm font-medium transition-all duration-200 hover:shadow-sm',
				{ 'opacity-40 hover:opacity-100': !isActive }, // Less visible when not active
				variant === 'default' &&
					'bg-ctp-blue/10 text-ctp-blue border-ctp-blue/20 hover:bg-ctp-blue/15 hover:border-ctp-blue/30 border',
				variant === 'secondary' &&
					'bg-ctp-surface1 text-ctp-text border-ctp-surface2 hover:bg-ctp-surface2 hover:border-ctp-overlay0 border',
				variant === 'success' &&
					'bg-ctp-green/10 text-ctp-green border-ctp-green/20 hover:bg-ctp-green/15 hover:border-ctp-green/30 border',
				variant === 'warning' &&
					'bg-ctp-yellow/10 text-ctp-yellow border-ctp-yellow/20 hover:bg-ctp-yellow/15 hover:border-ctp-yellow/30 border',
				variant === 'danger' &&
					'bg-ctp-red/10 text-ctp-red border-ctp-red/20 hover:bg-ctp-red/15 hover:border-ctp-red/30 border',
				className,
			)}
		>
			<span>{children}</span>
		</div>
	);
};
