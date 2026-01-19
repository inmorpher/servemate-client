'use client';
import { FC } from 'react';
import { ISidebarNavProps } from './types';

const SidebarNavigation: FC<ISidebarNavProps> = ({ children, title }) => {
	return (
		<>
			{title && <span className='text-ctp-mauve mb-4 text-lg font-bold'>{title}</span>}
			<nav className='flex-1 overflow-y-auto'>{children}</nav>
		</>
	);
};

export default SidebarNavigation;
