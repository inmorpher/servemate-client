'use client';

import { Logo } from '@/shared/components/logo';
import Sidebar from '@/shared/components/sidebar/Sidebar';

import { SidebarNavigation } from './SidebarNavigation';

import { TabsHorizontal } from '@/shared/components/tabs';
import { useDrawerStore } from '@/shared/store/useDrawerStore';
import { Menu } from 'lucide-react';
import { ReactNode } from 'react';

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
	const toggle = useDrawerStore((state) => state.toggle);

	return (
		<>
			{/* Header */}
			<header className='bg-ctp-base sticky inset-x-0 top-0 left-0 z-60 flex w-full flex-col gap-2 px-4 py-2 lg:h-14.25 lg:flex-row lg:place-items-baseline'>
				{/* Первая строка: Menu, Logo, TabsHorizontal */}
				<div className='flex w-full items-center gap-2'>
					<button
						onClick={() => toggle('sidebar')}
						className='p-2 lg:hidden'
						aria-label='Open menu'
					>
						<Menu className='text-ctp-text h-4 w-4' />
					</button>
					<div className='flex-1'>
						<Logo />
					</div>
					<div className='flex-2/3 items-end'>
						<TabsHorizontal />
					</div>
				</div>

				{/* Вторая строка: TabsDropdown только на мобилах */}
				{/* <div className='w-full lg:hidden'><TabsDropdown isMobile /></div> */}
			</header>

			{/* Sidebar*/}
			<div className='flex'>
				<Sidebar>
					<SidebarNavigation />
				</Sidebar>
				{/* <div className='fixed right-0 bottom-0 left-0 z-50 lg:hidden'>
					<TabsDropdown isMobile />
				</div> */}
				{/* Main */}
				<main className='flex-1 lg:mb-0'>{children}</main>
			</div>
		</>
	);
};

export default ProtectedLayout;
