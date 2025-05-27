'use client';
import { useSidebar } from '@/providers/SidebarProvider';
import { cn } from '@/shared/utils/classNames';

const SidebarMobileToggle = () => {
	const { isOpen, toggleSidebar } = useSidebar();

	return (
		<button
			onClick={toggleSidebar}
			className={cn(
				'lg:hidden fixed top-3 translate left-4 z-50 bg-ctp-mantle p-2 rounded-md shadow-md cursor-pointer transition-all duration-300',
				isOpen ? 'left-65 ml-4' : 'left-4'
			)}
			aria-label='Toggle Sidebar'
			aria-expanded={isOpen}
			aria-controls='sidebar-main'
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				className='h-6 w-6 text-ctp-text'
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
				/>
			</svg>
		</button>
	);
};

export default SidebarMobileToggle;
