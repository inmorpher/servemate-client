export type Tab = {
	id: string;
	path: string;
	title: string;
	timestamp: number;
	pinned?: boolean;
};

export type TabsStore = {
	tabs: Tab[];
	activeTabId: string;
	//Actions
	addTab: (tab: Tab) => void;
	removeTab: (tabId: string) => void;
	setActiveTab: (tabId: string) => void;
	pinTab: (tabId: string) => void;
	unpinTab: (tabId: string) => void;
	clearTabs: () => void;
};
