'use client';

import { useSidebar } from '@/providers/SidebarProvider';
import { cn } from '@/shared/utils/classNames';
import { FC } from 'react';
import { ISidebarProps } from './types';

const Sidebar: FC<ISidebarProps> = ({ children }) => {
	const { isOpen } = useSidebar();

	return (
		<aside
			className={cn(
				'bg-ctp-base fixed top-14.25 left-0 z-10 h-[calc(100vh-3.5625rem)] p-4 transition-all duration-150 ease-in-out lg:sticky lg:top-14.25 lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:self-start',
				isOpen ? 'w-64' : 'w-0 -translate-x-full lg:w-64 lg:translate-x-0',
			)}
		>
			<div className='flex flex-1 flex-col overflow-hidden'>{children}</div>
		</aside>
	);
};

export default Sidebar;
