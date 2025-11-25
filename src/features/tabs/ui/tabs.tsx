'use client';

import { useTabNavigation } from '../hooks/useTabNavigation';
import { useTabsSync } from '../hooks/useTabsSync';
import { useTabs } from '../store/useTabs';
import { TabItem } from './tab.item';

export const Tabs = () => {
	const { tabs, activeTabId } = useTabs();
	const { navigateToTab, closeTab } = useTabNavigation();

	useTabsSync();

	if (tabs.length === 0) {
		return null;
	}

	return (
		<div className='flex gap-0 bg-ctp-base  orverflow-x-auto corner-squircle '>
			{tabs.map((tab) => (
				<TabItem
					key={'tab-' + tab.id}
					tab={tab}
					isActive={tab.id === activeTabId}
					onSelect={() => navigateToTab(tab.id, tab.path)}
					onClose={() => closeTab(tab.id)}
				/>
			))}
		</div>
	);
};
