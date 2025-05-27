'use client';

import { useSidebar } from '@/providers/SidebarProvider';
import { cn } from '@/shared/utils/classNames';
import Image from 'next/image';
import LogoutButton from './LogoutButton';
import MobileSidebarToggle from './SidebarMobileToggle';
import NavLink from './SidebarNavItem';

export const Sidebar = () => {
	const { isOpen } = useSidebar();

	return (
		<>
			<MobileSidebarToggle />
			{/* Сайдбар */}
			<aside
				// className={`fixed top-0 left-0 h-full w-64 bg-ctp-base border-r border-ctp-surface0 shadow-lg p-4 z-40 transition-transform duration-300 lg:translate-x-0 ease-in ${
				// 	isOpen ? 'translate-x-0' : '-translate-x-full'
				// }`}
				className={cn(
					'fixed top-0 left-0 h-full w-64 bg-ctp-base border-r border-ctp-surface0 shadow-lg p-4 z-40 transition-transform duration-300 lg:translate-x-0 ease-in',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<div className='flex flex-col h-full'>
					{/* Логотип и заголовок */}
					<div className='flex items-center mb-6 pb-4 border-b border-ctp-surface0'>
						<Image src='/globe.svg' alt='ServateMate Logo' width={30} height={30} />
						<h1 className='ml-2 text-xl font-bold text-ctp-mauve'>ServeMate</h1>
					</div>

					{/* Навигационные ссылки */}
					<nav className='flex-1'>
						<NavLink href='/dashboard' icon='window' label='Панель управления' />
						<NavLink href='/account' icon='file' label='Мой профиль' />
						{/* Здесь можно добавить другие ссылки по мере необходимости */}
					</nav>

					{/* Log out button */}
					<div className='mt-auto pt-4 border-t border-ctp-surface0'>
						<LogoutButton />
					</div>
				</div>
			</aside>

			{/* Отступ для основного контента на больших экранах */}
		</>
	);
};
