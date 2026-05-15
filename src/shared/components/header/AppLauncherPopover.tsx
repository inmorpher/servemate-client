'use client';

import { logoutAction } from '@/features/auth/actions/logout';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { BarChart3, LogOut, Settings, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface AppItem {
	id: string;
	label: string;
	icon: React.ReactNode;
	href: string;
	color: string;
}

const appItems: AppItem[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		icon: <BarChart3 className='h-6 w-6' />,
		href: '/dashboard',
		color: 'bg-ctp-blue',
	},
	{
		id: 'cpanel',
		label: 'cPanel',
		icon: <ShoppingCart className='h-6 w-6' />,
		href: '/cpanel',
		color: 'bg-ctp-mauve',
	},
	{
		id: 'users',
		label: 'Users',
		icon: <Users className='h-6 w-6' />,
		href: '/users',
		color: 'bg-ctp-green',
	},
	{
		id: 'orders',
		label: 'Orders',
		icon: <ShoppingCart className='h-6 w-6' />,
		href: '/orders',
		color: 'bg-ctp-yellow',
	},
	{
		id: 'account',
		label: 'Account',
		icon: <Users className='h-6 w-6' />,
		href: '/account',
		color: 'bg-ctp-peach',
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: <Settings className='h-6 w-6' />,
		href: '/settings',
		color: 'bg-ctp-sky',
	},
];

export const AppLauncherPopover = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					className='text-ctp-text hover:bg-ctp-surface1 flex items-center justify-center rounded-md p-2 transition-colors'
					aria-label='App Launcher'
					title='App Launcher'
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

					{/* 3x3 Grid */}
					<div className='grid grid-cols-3 gap-3'>
						{appItems.map((app) => (
							<Link key={app.id} href={app.href}>
								<button
									onClick={() => setIsOpen(false)}
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
							</Link>
						))}
					</div>

					{/* Logout button */}
					<div className='bg-ctp-surface1 mt-4 h-px' />
					<button
						onClick={async () => {
							await logoutAction();
							setIsOpen(false);
						}}
						className='hover:bg-ctp-surface1 text-ctp-red flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors'
					>
						<LogOut className='h-4 w-4' />
						<span>Logout</span>
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
