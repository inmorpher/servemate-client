'use client';

import { cloneElement, isValidElement, ReactElement, RefObject } from 'react';
import { useHoverCardContext } from '../context/HoveCardContext';
import { HoverCardTriggerProps } from '../types';

export const HoverCardTrigger = ({ children, asChild = false }: HoverCardTriggerProps) => {
	const { triggerRef, scheduleOpen, scheduleClose } = useHoverCardContext();

	if (asChild && isValidElement(children)) {
		const childProps = children.props as any;

		return cloneElement(children as ReactElement<any>, {
			ref: triggerRef,
			onPointerEnter: (event: PointerEvent) => {
				childProps.onPointerEnter?.(event);
				scheduleOpen();
			},
			onPointerLeave: (event: PointerEvent) => {
				childProps.onPointerLeave?.(event);
				scheduleClose();
			},
			onFocus: (event: FocusEvent) => {
				childProps.onFocus?.(event);
				scheduleOpen();
			},
			onBlur: (event: FocusEvent) => {
				childProps.onBlur?.(event);
				scheduleClose();
			},
		});
	}

	return (
		<button
			ref={triggerRef as RefObject<HTMLButtonElement>}
			type='button'
			onPointerEnter={scheduleOpen}
			onPointerLeave={scheduleClose}
			onFocus={scheduleOpen}
			onBlur={scheduleClose}
		>
			{children}
		</button>
	);
};
