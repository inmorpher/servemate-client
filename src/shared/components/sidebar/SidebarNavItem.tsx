'use client';
import { useTabs } from '@/features/tabs/store/useTabs';
import Image from 'next/image';
import { FC } from 'react';
import { ISidebarNavItemProps } from './types';

const SidebarNavItem: FC<ISidebarNavItemProps> = ({ entity, icon, label }) => {
	const { addTab } = useTabs();
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		console.time('SidebarNavItem Clicked');
		addTab({ title: entity, entity: entity });
		console.timeEnd('SidebarNavItem Clicked');
	};

	return (
		<button className='block' onClick={handleClick}>
			<div
				className={`transition-all-3s mb-2 flex items-center rounded-md p-3 transition-colors`}
			>
				{
					//conditionally render the icon if it exists
				}
				{icon && (
					<Image
						src={`/${icon}.svg`}
						alt={label}
						width={20}
						height={20}
						className='mr-3'
					/>
				)}

				<span className='text-ctp-text font-medium'>{label}</span>
			</div>
		</button>
	);
};
export default SidebarNavItem;
