'use client';
import { useSidebar } from '@/providers/SidebarProvider';
import { cn } from '@/shared/lib/classNames';

const SidebarOverlay = () => {
	const { isOpen, toggleSidebar } = useSidebar();
	console.log('isOpen', isOpen);
	return (
		<div
			className={cn(
				'fixed top-14.25 bottom-0 left-0 z-10 h-dvh w-full overflow-y-auto lg:h-[calc(100vh-3.5625rem)]',
				isOpen ? 'bg-ctp-overlay0 backdrop-blur-sm' : 'pointer-events-none bg-transparent',
			)}
			onClick={toggleSidebar}
		/>
	);
};

export default SidebarOverlay;
