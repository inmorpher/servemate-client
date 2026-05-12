'use client';

import { cn } from '@/shared/utils/classNames';
import { createPortal } from 'react-dom';
import { useHoverCardContext } from '../context/HoveCardContext';
import { HoverCardContentProps } from '../types';

export const HoverCardContent = ({
	children,
	className,
	sideOffset = 4,
}: HoverCardContentProps) => {
	const { open, contentRef, position, scheduleOpen, scheduleClose } = useHoverCardContext();

	if (!open || typeof document === 'undefined') return null;

	return createPortal(
		<div
			ref={contentRef}
			role='tooltip'
			className={cn(
				'fixed z-50',
				'border-ctp-surface1 bg-ctp-surface0 text-ctp-text border',
				'corner-squircle rounded-2xl p-3 shadow-xl',
				className,
			)}
			style={{
				top: `${position.top + sideOffset}px`,
				left: `${position.left}px`,
			}}
			onPointerEnter={scheduleOpen}
			onPointerLeave={scheduleClose}
		>
			{children}
		</div>,
		document.body,
	);
};
