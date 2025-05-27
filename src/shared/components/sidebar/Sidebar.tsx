'use client';

import { useSidebar } from '@/providers/SidebarProvider';
import { cn } from '@/shared/utils/classNames';
import { FC } from 'react';
import { ISidebarProps } from './types';

const Sidebar: FC<ISidebarProps> = ({ children }) => {
	const { isOpen } = useSidebar();

	return (
		<>
			<aside
				className={cn(
					'fixed top-0 left-0 h-full w-64 bg-ctp-base border-r border-ctp-surface0 shadow-lg p-4 z-40 transition-transform duration-300 lg:translate-x-0',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<div className='flex flex-col h-full'>{children}</div>
			</aside>

			<div className='lg:ml-64 transition-all duration-300'></div>
		</>
	);
};

export default Sidebar;
