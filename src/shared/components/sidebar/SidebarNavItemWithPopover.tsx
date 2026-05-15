'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { ReactNode, useState } from 'react';

interface SidebarNavItemWithPopoverProps {
	entity: string;
	label: string;
	icon: ReactNode;
	color: string;
}

export const SidebarNavItemWithPopover = ({
	entity,
	label,
	icon,
	color,
}: SidebarNavItemWithPopoverProps) => {
	const { addTab } = useTabs();
	const [isOpen, setIsOpen] = useState(false);

	const handleClick = () => {
		addTab({ title: entity, entity: entity });
		setIsOpen(false);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					className={`relative flex h-10 w-10 items-center justify-center rounded-lg ${color} text-ctp-base hover:bg-opacity-90 group transition-all duration-200 hover:scale-110 focus:outline-none`}
					title={label}
				>
					<div className='transition-transform duration-200 group-hover:scale-110'>
						{icon}
					</div>
				</button>
			</PopoverTrigger>

			<PopoverContent
				className='border-ctp-surface1 bg-ctp-base w-fit rounded-lg border p-3 shadow-lg'
				side='right'
				align='center'
				sideOffset={8}
			>
				<div
					className='hover:bg-ctp-surface0 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 transition-colors'
					onClick={handleClick}
				>
					<div
						className={`flex h-8 w-8 items-center justify-center rounded-lg ${color} text-ctp-base shrink`}
					>
						{icon}
					</div>
					<span className='text-ctp-text text-sm font-medium whitespace-nowrap'>
						{label}
					</span>
				</div>
			</PopoverContent>
		</Popover>
	);
};
