'use client';

import { startTransition } from 'react';
import { useTabs } from '../store/useTabs';
import { TabItem } from './tab.item';

export const Tabs = () => {
	const { tabs, activeTabId, setActiveTab, removeTab } = useTabs();
	// useTabsSync();

	if (tabs.length === 0) {
		return null;
	}

	return (
		<div className='orverflow-x-auto flex w-full gap-1'>
			{tabs.map((tab) => (
				<TabItem
					key={'tab-' + tab.id}
					tab={tab}
					isActive={tab.id === activeTabId}
					onSelect={() => {
						startTransition(() => {
							setActiveTab(tab.id);
						});
					}}
					onClose={() => removeTab(tab.id)}
				/>
			))}
		</div>
	);
};
