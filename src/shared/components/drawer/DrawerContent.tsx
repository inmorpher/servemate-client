'use client';

import { useSwipe } from '@/shared/hooks/useSwipe';
import { cn } from '@/shared/utils/classNames';
import { FC, useRef } from 'react';
import { DrawerContentProps } from './types';

/**
 * Renders drawer content positioned and styled according to the provided direction.
 *
 * @remarks
 * This component is responsible for the visual container of a drawer panel and applies
 * position-specific classes and transition styles. The `onOpenChange` prop is accepted
 * to allow parent components to control drawer state but is not consumed internally.
 *
 * @param children - React nodes to be rendered inside the drawer.
 * @param direction - Anchoring direction of the drawer. Expected values: "left", "right", "top", or "bottom".
 * @param onOpenChange - Optional callback invoked when the drawer's open/close state changes (provided for parent control).
 * @returns A JSX element representing the drawer content container.
 *
 * @example
 * <DrawerContent direction="right" onOpenChange={(open) => setIsOpen(open)}>
 *   <YourPanelContent />
 * </DrawerContent>
 */
export const DrawerContent: FC<DrawerContentProps> = ({
	children,
	direction,
	size = 'medium',
	isOpen,
	onOpenChange,
	className,
}) => {
	const drawerRef = useRef<HTMLDivElement>(null);

	useSwipe(drawerRef, {
		onSwipeLeft: () => {
			if (direction === 'left') onOpenChange?.(false);
		},
		onSwipeRight: () => {
			if (direction === 'right') onOpenChange?.(false);
		},
		threshold: 50,
	});

	// Define size classes for each direction
	const sizeClasses = {
		left: {
			small: 'w-1/3',
			medium: 'w-1/2',
			large: 'w-3/4',
			auto: 'w-auto max-w-96',
		},
		right: {
			small: 'w-1/3',
			medium: 'w-1/2',
			large: 'w-3/4',
			auto: 'w-auto max-w-96',
		},
		top: {
			small: 'h-1/4',
			medium: 'h-1/2',
			large: 'h-2/3',
			auto: 'h-fit max-h-[60vh]',
		},
		bottom: {
			small: 'h-1/4',
			medium: 'h-1/2',
			large: 'h-2/3',
			auto: 'h-fit max-h-[60vh]',
		},
	};

	// Define classes for each direction
	const directionClasses = {
		left: isOpen
			? `left-0 top-0 h-full ${sizeClasses.left[size]} border-r border-ctp-surface1 translate-x-0`
			: `left-0 top-0 h-full ${sizeClasses.left[size]} border-r border-ctp-surface1 -translate-x-full`,
		right: isOpen
			? `right-0 top-0 h-full ${sizeClasses.right[size]} border-l border-ctp-surface1 translate-x-0`
			: `right-0 top-0 h-full ${sizeClasses.right[size]} border-l border-ctp-surface1 translate-x-full`,
		top: isOpen
			? `top-0 left-0 w-full ${sizeClasses.top[size]} border-b border-ctp-surface1 translate-y-0`
			: `top-0 left-0 w-full ${sizeClasses.top[size]} border-b border-ctp-surface1 -translate-y-full`,
		bottom: isOpen
			? `bottom-0 left-0 w-full ${sizeClasses.bottom[size]} border-t border-ctp-surface1 translate-y-0`
			: `bottom-0 left-0 w-full ${sizeClasses.bottom[size]} border-t border-ctp-surface1 translate-y-full`,
	};

	return (
		<div
			ref={drawerRef}
			className={cn(
				'bg-ctp-base fixed z-50',
				'transition-all duration-300 ease-in-out',
				directionClasses[direction],
				className,
			)}
			onClick={(e) => e.stopPropagation()}
		>
			{children}
		</div>
	);
};
