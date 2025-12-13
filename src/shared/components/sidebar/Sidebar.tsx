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
				'bg-ctp-base sticky top-14.25 left-0 z-10 h-[calc(100vh-3.5625rem)] w-64 shrink-0 self-start overflow-y-auto p-4 transition-transform duration-150 ease-in-out lg:translate-x-0',
				isOpen ? 'translate-x-0' : '-translate-x-full',
			)}
		>
			<div className='flex h-full flex-col'>{children}</div>
		</aside>
	);
};

export default Sidebar;
