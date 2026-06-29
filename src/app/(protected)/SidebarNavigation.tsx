'use client';

import { SidebarNavItemWithPopover } from '@/shared/components/sidebar/SidebarNavItemWithPopover';
import { BarChart3, Settings, ShoppingCart, Users } from 'lucide-react';

export const SidebarNavigation = () => {
	return (
		<nav className='flex flex-col items-center gap-5'>
			<SidebarNavItemWithPopover
				entity='dashboard'
				label='Dashboard'
				icon={<BarChart3 className='h-5 w-5' />}
				color='bg-ctp-blue'
			/>
			<SidebarNavItemWithPopover
				entity='orders'
				label='orders'
				icon={<ShoppingCart className='h-5 w-5' />}
				color='bg-ctp-mauve'
			/>
			<SidebarNavItemWithPopover
				entity='users'
				label='Users'
				icon={<Users className='h-5 w-5' />}
				color='bg-ctp-green'
			/>
			<SidebarNavItemWithPopover
				entity='settings'
				label='Settings'
				icon={<Settings className='h-5 w-5' />}
				color='bg-ctp-sky'
			/>
		</nav>
	);
};
