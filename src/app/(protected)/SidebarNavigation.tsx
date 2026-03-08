'use client';

import SidebarNavItem from '@/shared/components/sidebar/SidebarNavItem';

export const SidebarNavigation = () => {
	return (
		<nav className='flex flex-col items-center gap-5'>
			<SidebarNavItem entity='dashboard' icon='window' label='Dashboard' />
			<SidebarNavItem entity='orders' icon='file' label='cPanel' />
			<SidebarNavItem entity='users' icon='file' label='Users' />
			<SidebarNavItem entity='account' icon='file' label='Orders' />
		</nav>
	);
};
