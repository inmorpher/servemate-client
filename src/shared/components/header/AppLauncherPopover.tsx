'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { useSidebarNavigation } from '@/shared/hooks/useSidebarNavigation';
import { BarChart3, Settings, ShoppingCart, Users } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface AppItem {
	id: string;
	label: string;
	entity: string;
	icon: ReactNode;
	href: string;
	color: string;
}

const appItems: AppItem[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		entity: 'dashboard',
		icon: <BarChart3 className='h-6 w-6' />,
		href: '/dashboard',
		color: 'bg-ctp-blue',
	},
	{
		id: 'cpanel',
		label: 'cPanel',
		entity: 'cpanel',
		icon: <ShoppingCart className='h-6 w-6' />,
		href: '/cpanel',
		color: 'bg-ctp-mauve',
	},
	{
		id: 'users',
		label: 'Users',
		entity: 'users',
		icon: <Users className='h-6 w-6' />,
		href: '/users',
		color: 'bg-ctp-green',
	},
	{
		id: 'orders',
		label: 'Orders',
		entity: 'orders',
		icon: <ShoppingCart className='h-6 w-6' />,
		href: '/orders',
		color: 'bg-ctp-yellow',
	},
	{
		id: 'account',
		label: 'Account',
		entity: 'account',
		icon: <Users className='h-6 w-6' />,
		href: '/account',
		color: 'bg-ctp-peach',
	},
	{
		id: 'settings',
		label: 'Settings',
		entity: 'settings',
		icon: <Settings className='h-6 w-6' />,
		href: '/settings',
		color: 'bg-ctp-sky',
	},
];

export const AppLauncherPopover = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { navigateToItem } = useSidebarNavigation();

	const handleAppClick = (app: AppItem) => {
		navigateToItem({ entity: app.entity, label: app.label, href: app.href });
		setIsOpen(false);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					className='text-ctp-text hover:bg-ctp-surface1 flex items-center justify-center rounded-md p-2 transition-colors'
					aria-label='App Launcher'
					title='App Launcher'
					type='button'
				>
					<div className='grid grid-cols-3 gap-1'>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
						<div className='bg-ctp-text h-1.5 w-1.5 rounded-sm'></div>
					</div>
				</button>
			</PopoverTrigger>

			<PopoverContent
				className='border-ctp-surface1 bg-ctp-base w-80 rounded-lg border p-4 shadow-lg'
				side='bottom'
				align='start'
				sideOffset={8}
			>
				<div className='space-y-3'>
					<h2 className='text-ctp-text px-2 text-sm font-semibold'>Applications</h2>

					<div className='grid grid-cols-3 gap-3'>
						{appItems.map((app) => (
							<button
								key={app.id}
								type='button'
								onClick={() => handleAppClick(app)}
								className={`flex aspect-square w-full flex-col items-center justify-center rounded-lg ${app.color} text-ctp-base p-2 transition-opacity hover:opacity-90`}
								title={app.label}
							>
								<div className='mb-2 flex h-8 w-8 items-center justify-center'>
									{app.icon}
								</div>
								<span className='line-clamp-2 text-center text-xs font-medium'>
									{app.label}
								</span>
							</button>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
