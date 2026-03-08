'use client';

import { cn } from '@/shared/utils/classNames';
import { FC } from 'react';
import { ISidebarProps } from './types';

const Sidebar: FC<ISidebarProps> = ({ children }) => {
	return (
		<aside
			className={cn(
				'bg-ctp-base fixed bottom-0 z-10 w-full p-1 lg:sticky lg:top-14.25 lg:flex lg:h-[calc(100vh-3.5625rem)] lg:w-10 lg:shrink-0 lg:flex-col lg:self-start',
			)}
		>
			<div className='flex flex-1 flex-col overflow-hidden'>{children}</div>
		</aside>
	);
};

export default Sidebar;
