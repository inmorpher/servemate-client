'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { ISidebarNavItemProps } from './types';

const SidebarNavItem: FC<ISidebarNavItemProps> = ({ href, icon, label }) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link href={href} className='block'>
			<div
				className={`flex items-center p-3 mb-2 rounded-md transition-colors transition-all-3s ${
					isActive ? 'bg-ctp-surface1 text-ctp-mauve' : 'hover:bg-ctp-surface0 text-ctp-text'
				}`}
			>
				{
					//conditionally render the icon if it exists
				}
				{icon && <Image src={`/${icon}.svg`} alt={label} width={20} height={20} className='mr-3' />}

				<span className='font-medium'>{label}</span>
			</div>
		</Link>
	);
};
export default SidebarNavItem;
