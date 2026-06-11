'use client';

import { Logo } from '@/shared/components/logo';
import Sidebar from '@/shared/components/sidebar/Sidebar';

import { SidebarNavigation } from './SidebarNavigation';

import { AppLauncherPopover } from '@/shared/components/header/AppLauncherPopover';
import { HeaderActionsMenu } from '@/shared/components/header/HeaderActionsMenu';
import { TabsDropdown, TabsHorizontal } from '@/shared/components/tabs';
import { useDrawerStore } from '@/shared/store/useDrawerStore';
import { Menu } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * ProtectedLayout
 *
 * Main layout wrapper for authenticated/protected routes in ServeMate.
 * Provides a sticky header with navigation, app launcher, and actions menu,
 * paired with a collapsible sidebar for main navigation.
 *
 * Responsive design:
 * - **Mobile** (<lg): Shows AppLauncherPopover, TabsDropdown for navigation
 * - **Desktop** (lg+): Shows Menu toggle button, TabsHorizontal for navigation, full sidebar
 *
 * @param props - Layout configuration
 * @param props.children - Page content to render in the main area
 * @returns A responsive layout with header, sidebar, and main content area
 *
 * @example
 * ```tsx
 * // Inside app/(protected)/page.tsx
 * export default function DashboardPage() {
 *   return <ProtectedLayout><Dashboard /></ProtectedLayout>;
 * }
 * // ProtectedLayout is applied automatically via Next.js layout.tsx
 * ```
 *
 * @see {@link ListPageLayout} - Sub-layout for list-based pages
 * @see {@link src/shared/components/header} - Header components
 */

interface ProtectedLayoutProps {
	/** React node(s) to render in the main content area */
	children: ReactNode;
}

const HEADER_HEIGHT = '14.24';

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
	const toggle = useDrawerStore((state) => state.toggle);

	return (
		<>
			{/* Header with sticky positioning */}
			<header
				className={`bg-ctp-base sticky inset-x-0 top-0 left-0 z-40 flex w-full items-center gap-2 px-4 py-2 lg:h-${HEADER_HEIGHT}`}
			>
				{/*
				 * Menu button for sidebar toggle.
				 * Desktop only (lg+) — allows toggling sidebar visibility state
				 */}
				<button
					onClick={() => toggle('sidebar')}
					className='hidden p-2 lg:block'
					aria-label='Toggle sidebar'
				>
					<Menu className='text-ctp-text h-4 w-4' />
				</button>

				{/* App Launcher - Mobile only (<lg) - used for app switcher on small screens */}
				<div className='flex lg:hidden'>
					<AppLauncherPopover />
				</div>

				{/* Logo container */}
				<div className='flex'>
					<Logo />
				</div>

				{/*
				 * Navigation tabs with responsive toggle.
				 * Desktop (lg+): TabsHorizontal for horizontal navigation menu
				 * Mobile (<lg): TabsDropdown for space-efficient dropdown menu
				 */}
				<div className='hidden flex-1 lg:flex'>
					<TabsHorizontal />
				</div>
				<div className='flex flex-1 lg:hidden'>
					<TabsDropdown isMobile />
				</div>

				{/* Actions menu containing notifications, account, and settings */}
				<div className='shrink justify-self-end'>
					<HeaderActionsMenu notificationCount={0} />
				</div>
			</header>

			{/* Sidebar and main content container */}
			<div className='flex min-w-0'>
				<Sidebar>
					<SidebarNavigation />
				</Sidebar>
				{/* <div className='fixed right-0 bottom-0 left-0 z-50 lg:hidden'>
					<TabsDropdown isMobile />
				</div> */}
				{/* Main content area - flexes to fill available space */}
				<main className='relative min-h-0 min-w-0 flex-1 overflow-hidden lg:mb-0'>
					{children}
				</main>
			</div>
		</>
	);
};

export default ProtectedLayout;
