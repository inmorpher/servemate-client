'use client';
import { useSidebar } from '@/providers/SidebarProvider';

const SidebarOverlay = () => {
	const { isOpen, toggleSidebar } = useSidebar();
	console.log('isOpen', isOpen);
	return (
		<div
			className={`fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}
				`}
			onClick={toggleSidebar}
		/>
	);
};

export default SidebarOverlay;
