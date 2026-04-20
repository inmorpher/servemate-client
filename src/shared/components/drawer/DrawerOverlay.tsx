'use client';

import { cn } from '@/shared/utils/classNames';
import { FC } from 'react';

import { DrawerOverlayProps } from './types';

/**
 * Overlay backdrop for a Drawer component.
 *
 * Renders a full-viewport, semi-transparent element that dims and blocks
 * interaction with the underlying UI. When clicked, it requests the drawer
 * be closed by calling the provided onOpenChange callback with false.
 *
 * @param onOpenChange - Callback invoked to change the open state of the drawer.
 *                        Called as onOpenChange(false) when the overlay is clicked.
 * @returns A JSX element representing the overlay backdrop.
 */
export const DrawerOverlay: FC<DrawerOverlayProps> = ({ onOpenChange, id = 'overlay' }) => {
	return (
		<div
			id={`${id}-overlay`}
			className={cn(
				'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300',
			)}
			onClick={() => onOpenChange(false)}
		/>
	);
};
