import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useTabs } from '../store/useTabs';

export const useTabNavigation = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { tabs, removeTab } = useTabs();

	// Save tabId pending removal, as we need to wait for pathname change or it will add back the tab.
	const pendingRemoveRef = useRef<string | null>(null);

	// useEffect to actually remove the tab after navigation and only if needed
	useEffect(() => {
		if (pendingRemoveRef.current && pendingRemoveRef.current !== pathname) {
			removeTab(pendingRemoveRef.current);
			pendingRemoveRef.current = null;
		}
	}, [pathname, removeTab]);

	const navigateToTab = (tabId: string, path: string) => {
		router.push(path);
	};

	const closeTab = (tabId: string) => {
		const tabToClose = tabs.find((t) => t.id === tabId);

		if (tabToClose?.path === pathname) {
			// If url path === tab beeing closed, we need to add path to ref and naviagate firt,
			// useEffect will remove the tab after naviagition.
			const newTabs = tabs.filter((t) => t.id !== tabId);
			const nextPath = newTabs.length > 0 ? newTabs[newTabs.length - 1].path : '/dashboard';

			// Saving tabId to be removed after navigation.
			pendingRemoveRef.current = tabId;
			router.push(nextPath);
		} else {
			// If we are closing tab with !== current path, we can remove it instantly.
			removeTab(tabId);
		}
	};

	return { navigateToTab, closeTab };
};
