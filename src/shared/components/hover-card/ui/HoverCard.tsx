'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { HoverCardContext } from '../context/HoveCardContext';
import { HoverCardContextValue, HoverCardProps } from '../types';
import { calculatePositionForHoverCard } from '../utils/calculatePositionForHoberCard';

const SIDE_OFFSET = 4;

export const HoverCard = ({
	children,
	defaultOpen = false,
	open: controlledOpen,
	onOpenChange,
	openDelay = 500,
	closeDelay = 150,
	side = 'bottom',
	align = 'center',
	sideOffset = SIDE_OFFSET,
}: HoverCardProps) => {
	// State
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const [position, setPosition] = useState({ top: 0, left: 0 });

	// Refs
	const triggerRef = useRef<HTMLElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);
	const openTimerRef = useRef<NodeJS.Timeout | null>(null);
	const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Controlled or uncontrolled open state
	const open = controlledOpen ?? uncontrolledOpen;

	const setOpen = useCallback(
		(nextOpen: boolean) => {
			if (controlledOpen === undefined) {
				setUncontrolledOpen(nextOpen);
			}
			onOpenChange?.(nextOpen);
		},
		[controlledOpen, onOpenChange],
	);

	const clearTimers = useCallback(() => {
		if (openTimerRef.current !== null) {
			clearTimeout(openTimerRef.current);
			openTimerRef.current = null;
		}
		if (closeTimerRef.current !== null) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
	}, []);

	const updatePosition = useCallback(() => {
		if (!triggerRef.current || !contentRef.current) return;

		const triggerRect = triggerRef.current.getBoundingClientRect();
		const contentSize = {
			width: contentRef.current.offsetWidth,
			height: contentRef.current.offsetHeight,
		};

		const newPosition = calculatePositionForHoverCard(
			triggerRect,
			contentSize,
			side,
			align,
			sideOffset,
		);

		setPosition(newPosition);
	}, [side, align, sideOffset]);

	const scheduleOpen = useCallback(() => {
		clearTimers();
		openTimerRef.current = setTimeout(() => {
			setOpen(true);
			requestAnimationFrame(() => {
				updatePosition();
			});
		}, openDelay);
	}, [clearTimers, openDelay, setOpen, updatePosition]);

	const scheduleClose = useCallback(() => {
		clearTimers();
		closeTimerRef.current = setTimeout(() => {
			setOpen(false);
		}, closeDelay);
	}, [clearTimers, closeDelay, setOpen]);

	// Cleanup timers on unmount
	useEffect(() => {
		return () => clearTimers();
	}, [clearTimers]);

	// Handle scroll, resize, keyboard events
	useEffect(() => {
		if (!open) return;

		const handleScroll = () => updatePosition();
		const handleResize = () => updatePosition();
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setOpen(false);
			}
		};

		window.addEventListener('scroll', handleScroll, true);
		window.addEventListener('resize', handleResize);
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('scroll', handleScroll, true);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [open, updatePosition, setOpen]);

	const value: HoverCardContextValue = {
		open,
		setOpen,
		triggerRef,
		contentRef,
		position,
		updatePosition,
		scheduleOpen,
		scheduleClose,
		clearTimers,
		side,
		align,
		sideOffset,
	};

	return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>;
};
