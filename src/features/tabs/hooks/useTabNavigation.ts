import { useRouter } from 'next/navigation';
import { useTabs } from '../store/useTabs';

export const useTabNavigation = () => {
	const router = useRouter();

	const { tabs, activeTabId, removeTab } = useTabs.getState();

	const navigateToTab = (tabId: string, path: string) => {
		router.push(path);
	};

	const closeTab = (tabId: string) => {
		console.log('Closing tab:', tabId);
		let nextPath = '';

		if (tabId === activeTabId) {
			const newTabs = tabs.filter((t) => t.id !== tabId);
			if (newTabs.length > 0) {
				nextPath = newTabs[newTabs.length - 1].path;
			} else {
				nextPath = '/dashboard';
			}
		}

		removeTab(tabId);

		if (nextPath) {
			router.push(nextPath);
		}
	};

	return { navigateToTab, closeTab };
};
