'use client';

import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DrawerContent } from './DrawerContent';
import { DrawerOverlay } from './DrawerOverlay';
import { DrawerProps } from './types';

/**
 * Drawer component that displays a sliding panel from a specified direction.
 *
 * @param {DrawerProps} props - The props for the Drawer component.
 * @param {boolean} props.isOpen - Controls whether the drawer is open.
 * @param {(open: boolean) => void} props.onOpenChange - Callback invoked when the open state changes.
 * @param {'left' | 'right' | 'top' | 'bottom'} [props.direction='left'] - The direction from which the drawer appears.
 * @param {React.ReactNode} props.children - The content to display inside the drawer.
 *
 * @returns {JSX.Element | null} The rendered Drawer component, or null if not open.
 */
export const Drawer: FC<DrawerProps> = ({
	isOpen,
	onOpenChange,
	direction = 'left',
	size = 'medium',
	id = 'drawer',
	children,
	className,
}) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		if (isOpen) {
			// Prevent background scrolling when the drawer is open
			document.body.style.overflow = 'hidden';
		} else {
			// Restore scrolling when the drawer is closed
			document.body.style.overflow = '';
		}

		// Cleanup
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen, mounted]);

	if (!mounted) return null;

	return createPortal(
		<>
			{isOpen && <DrawerOverlay onOpenChange={onOpenChange} id={`${id}-overlay`} />}
			<DrawerContent
				direction={direction}
				size={size}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				className={className}
				id={id}
			>
				{children}
			</DrawerContent>
		</>,
		document.body,
	);
};
