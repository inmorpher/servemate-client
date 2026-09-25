export type TabFilters<T> = {
	[key in keyof T]?: T[key];
};

export type TabEntities =
	| 'users'
	| 'orders'
	| 'reservations'
	| 'products'
	| 'dashboard'
	| 'settings'
	| 'cpanel';

const TAB_ENTITIES: readonly TabEntities[] = [
	'users',
	'orders',
	'reservations',
	'products',
	'dashboard',
	'settings',
	'cpanel',
];

export const isTabEntity = (value: string): value is TabEntities =>
	TAB_ENTITIES.includes(value as TabEntities);

export type Tab<T = {}> = {
	id: string;
	title: string;
	timestamp?: Date | number;
	pinned?: boolean;
	entity: TabEntities;
	filters?: TabFilters<T>;
};

export type WorkspaceTabState = {
	id: string;
	title: string;
	type: string;
	state?: Record<string, unknown>;
	pinned?: boolean;
	order: number;
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
	clearFilters: (tabId: string) => void;
	clearTabs: () => void;
	hydrateWorkspace: (workspace: { tabs: WorkspaceTabState[]; activeTabId?: string }) => void;
};
