'use client';
import { NavButton } from '@/shared/components/nav-button/NavButton';
import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { FC } from 'react';
import { ISidebarNavItemProps } from './types';

const SidebarNavItem: FC<ISidebarNavItemProps> = ({ entity, icon, label }) => {
	const { addTab } = useTabs();

	const handleClick = () => {
		addTab({ title: entity, entity: entity });
	};

	return <NavButton label={label} icon={icon} onClick={handleClick} variant='sidebar' />;
};

export default SidebarNavItem;
