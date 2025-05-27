'use client';

import { useSidebar } from '@/providers/SidebarProvider';

const MobileSidebarToggle = () => {
	const { isOpen, toggleSidebar } = useSidebar();
	return (
		<>
			<button
				onClick={toggleSidebar}
				className='lg:hidden fixed top-4 left-4 z-50 bg-ctp-mantle p-2 rounded-md shadow-md'
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

			{/* Затемнение фона при открытом мобильном меню */}
			<div
				className={`fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden transition-opacity duration-300 ${
					isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
				}`}
				onClick={toggleSidebar}
			></div>
		</>
	);
};

export default MobileSidebarToggle;
