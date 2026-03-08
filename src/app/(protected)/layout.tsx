import { Logo } from '@/shared/components/logo';
import Sidebar from '@/shared/components/sidebar/Sidebar';

import { TabsDropdown, TabsHorizontal } from '@/shared/components/tabs';
import { SidebarNavigation } from './SidebarNavigation';

import { ReactNode } from 'react';

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
	return (
		<>
			{/* Header */}
			<header className='border-ctp-surface1 bg-ctp-mantle fixed inset-x-0 top-0 left-0 z-20 flex h-14.25 w-full place-items-baseline gap-2 px-4'>
				<div className='flex-1'>
					<Logo />
				</div>
				<div className='flex-2/3'>
					<TabsHorizontal />
				</div>
			</header>

			{/* Sidebar*/}
			<div className='mt-14.25 flex'>
				<Sidebar>
					<TabsDropdown isMobile />
					<SidebarNavigation />
				</Sidebar>

				{/* Main */}
				<main className='mb-20 flex-1 lg:mb-0'>{children}</main>
			</div>
		</>
	);
};

export default ProtectedLayout;
