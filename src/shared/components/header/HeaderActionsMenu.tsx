'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { Bell, LogOut, MoreVertical, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NotificationItem {
	id: string;
	message: string;
	timestamp: Date;
	isRead: boolean;
}

interface HeaderActionsMenuProps {
	notificationCount?: number;
	notifications?: NotificationItem[];
}

export const HeaderActionsMenu = ({
	notificationCount = 0,
	notifications = [],
}: HeaderActionsMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		// TODO: implement logout
		router.push('/login');
		setIsOpen(false);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					className='text-ctp-text hover:bg-ctp-surface1 relative flex items-center justify-center rounded-md p-2 transition-colors'
					aria-label='Menu'
				>
					<MoreVertical className='h-5 w-5' />
					{notificationCount > 0 && (
						<span className='bg-ctp-red text-ctp-crust absolute top-1 right-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold'>
							{notificationCount > 9 ? '9+' : notificationCount}
						</span>
					)}
				</button>
			</PopoverTrigger>

			<PopoverContent
				className='border-ctp-surface1 bg-ctp-base w-48 rounded-lg border p-2 shadow-lg'
				side='bottom'
				align='end'
				sideOffset={15}
			>
				<div className='flex flex-col gap-2'>
					{/* Notifications Section */}
					{notificationCount > 0 && (
						<>
							<button className='hover:bg-ctp-surface1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors'>
								<Bell className='text-ctp-yellow h-4 w-4 shrink' />
								<div className='min-w-0 flex-1'>
									<p className='text-ctp-text truncate font-medium'>
										Notifications
									</p>
									<p className='text-ctp-subtext1 text-xs'>
										{notificationCount} new
									</p>
								</div>
							</button>
							<div className='bg-ctp-surface1 h-px' />
						</>
					)}

					{/* Account */}
					<Link href='/account'>
						<button className='hover:bg-ctp-surface1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors'>
							<User className='text-ctp-blue h-4 w-4 shrink' />
							<span className='text-ctp-text'>Account</span>
						</button>
					</Link>

					{/* Settings */}
					<Link href='/settings'>
						<button className='hover:bg-ctp-surface1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors'>
							<Settings className='text-ctp-green h-4 w-4 shrink' />
							<span className='text-ctp-text'>Settings</span>
						</button>
					</Link>

					{/* Logout */}
					<div className='bg-ctp-surface1 h-px' />
					<button
						onClick={handleLogout}
						className='hover:bg-ctp-surface2 text-ctp-red flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors'
					>
						<LogOut className='h-4 w-4 shrink' />
						<span>Logout</span>
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
