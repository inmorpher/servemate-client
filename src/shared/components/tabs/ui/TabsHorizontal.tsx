'use client';

import { useTabs } from '../store/useTabs';
import { TabItem } from './TabItem';

type TabsHorizontalProps = {
	isMobile?: boolean;
};

export const TabsHorizontal = ({ isMobile = false }: TabsHorizontalProps) => {
	const { tabs, activeTabId, setActiveTab, removeTab } = useTabs();

	if (tabs.length === 0) {
		return null;
	}

	const handleTabSelect = (tabId: string) => {
		setActiveTab(tabId);
	};

	return (
		<div
			className={`ml-1.5 gap-2 self-end overflow-x-auto p-1 lg:flex ${isMobile ? 'lg:flex' : 'hidden'}`}
		>
			{tabs.map((tab) => (
				<TabItem
					key={'tab-' + tab.id}
					tab={tab}
					isActive={tab.id === activeTabId}
					onSelect={() => handleTabSelect(tab.id)}
					onClose={() => removeTab(tab.id)}
				/>
			))}
		</div>
	);
};
