'use client';

import { useDrawerStore } from '@/shared/store/useDrawerStore';
import { cn } from '@/shared/utils/classNames';
import { FC } from 'react';
import { Drawer } from '../drawer/Drawer';
import { ISidebarProps } from './types';

const Sidebar: FC<ISidebarProps> = ({ children }) => {
	const sidebarIsOpen = useDrawerStore((state) => state.isOpen('sidebar'));
	const toggle = useDrawerStore((state) => state.toggle);

	console.log('Sidebar render, isOpen:', sidebarIsOpen);

	return (
		<>
			{/* Desktop */}
			<aside
				aria-label='Side navigation'
				className={cn(
					'bg-ctp-base sticky top-14.25 z-10 hidden h-[calc(100vh-3.5625rem)] w-10 shrink-0 flex-col self-start p-1 md:flex',
				)}
			>
				<nav className='flex flex-1 flex-col overflow-hidden'>{children}</nav>
			</aside>

			{/* Mobile */}
			<Drawer isOpen={sidebarIsOpen} onOpenChange={() => toggle('sidebar')} direction='left'>
				<nav className='flex flex-col gap-4 pt-12' aria-label='Mobile side navigation'>
					{children}
				</nav>
			</Drawer>
		</>
	);
};

export default Sidebar;
