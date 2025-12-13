'use client';
import { useSidebar } from '@/providers/SidebarProvider';

const SidebarOverlay = () => {
	const { isOpen, toggleSidebar } = useSidebar();
	console.log('isOpen', isOpen);
	return (
		<div
			className='fixed top-14.25 left-0 z-10 h-[calc(100vh-3.5625rem)] w-64 overflow-y-auto'
			onClick={toggleSidebar}
		/>
	);
};

export default SidebarOverlay;
