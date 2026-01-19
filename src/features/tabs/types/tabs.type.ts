export type TabFilters<T> = {
	[key in keyof T]?: T[key];
};

export type Tab<T = {}> = {
	id: string;
	title: string;
	timestamp?: Date | number;
	pinned?: boolean;
	entity: string;
	filters?: TabFilters<T>;
};

export type TabsStore = {
	getTabById(tabId: string): Tab | undefined;
	tabs: Tab[];
	activeTabId: string;

	//Actions
	addTab: (tab: Omit<Tab, 'id'>) => void;
	removeTab: (tabId: string) => void;
	setActiveTab: (tabId: string) => void;
	pinTab: (tabId: string) => void;
	unpinTab: (tabId: string) => void;
	updateTab: (tabId: string, fields: Partial<Tab>) => void;
	clearTabs: () => void;
};
