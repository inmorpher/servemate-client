'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useTabs } from '../store/useTabs';
import { getTabTitle } from '../utils/tabs.utils';

export const useTabsSync = () => {
	const pathname = usePathname();
	const { tabs, addTab, activeTabId, setActiveTab } = useTabs();

	useEffect(() => {
		// Skip adding tabs for login and dashboard

		if (pathname === '/login' || pathname === '/dashboard') {
			return;
		}

		// Check if tab already exists
		const existingTab = tabs.find((t) => t.path === pathname);

		if (existingTab) {
			// Tab exists, set it as active
			if (existingTab.id !== activeTabId) {
				setActiveTab(existingTab.id);
			}
		} else {
			// Tab doesn't exist, create a new one
			const newTab = {
				id: pathname,
				path: pathname,
				title: getTabTitle(pathname),
				timestamp: Date.now(),
				pinned: false,
			};

			addTab(newTab);
		}
		console.log('Current tabs:', tabs, activeTabId);
	}, [pathname, tabs, addTab, activeTabId, setActiveTab]);
};
