'use client';
import { FC } from 'react';
import { ISidebarNavProps } from './types';

const SidebarNavigation: FC<ISidebarNavProps> = ({ children, title }) => {
	return (
		<>
			{title && <span className='text-lg font-bold text-ctp-mauve mb-4'>{title}</span>}
			<nav className='flex-1'>{children}</nav>
		</>
	);
};

export default SidebarNavigation;
