'use client';
import { useTabs } from '@/shared/components/tabs/store/useTabs';
import Image from 'next/image';
import { FC } from 'react';
import { Button } from '../button';
import { ISidebarNavItemProps } from './types';

const SidebarNavItem: FC<ISidebarNavItemProps> = ({ entity, icon, label }) => {
	const { addTab } = useTabs();

	const handleClick = () => {
		addTab({ title: entity, entity: entity });
	};

	return (
		<Button variant='ghost' size='icon' onClick={handleClick} aria-label={label}>
			{icon && <Image src={`/${icon}.svg`} alt={label} width={30} height={20} />}
		</Button>
	);
};

export default SidebarNavItem;
