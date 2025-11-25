'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tab, TabsStore } from '../types/tabs.type';

const MAX_TABS = 10;
export const useTabs = create<TabsStore>()(
	persist(
		(set, get) => ({
			tabs: [],
			activeTabId: '',
			// Add tabs
			addTab: (tab: Tab) => {
				const { tabs } = get();

				if (tabs.some((t) => t.id == tab.id)) {
					set({ activeTabId: tab.id });
					return;
				}
				if (tabs.length >= MAX_TABS) {
					alert(`You can only have a maximum of ${MAX_TABS} tabs open at once.`);
					return;
				}

				set({
					tabs: [...tabs, tab],
					activeTabId: tab.id,
				});
			},
			// Remove tab
			removeTab: (tabId: string) => {
				console.log('Removing tab:', tabId);
				const { tabs, activeTabId } = get();
				const newTabs = tabs.filter((t) => t.id !== tabId);
				let newActiveTabId = activeTabId;

				if (tabId === activeTabId) {
					if (newTabs.length > 0) {
						newActiveTabId = newTabs[newTabs.length - 1].id;
					}
				} else {
					newActiveTabId = '';
				}

				set({
					tabs: newTabs,
					activeTabId: newActiveTabId,
				});
			},
			// Set active tab
			setActiveTab: (tabId: string) => {
				const { tabs } = get();
				const tab = tabs.find((t) => t.id === tabId);

				if (tab) {
					set({ activeTabId: tabId });
				}
			},
			// Pin tab
			pinTab: (tabId: string) => {
				const { tabs } = get();
				const newTabs = tabs.map((t) => (t.id === tabId ? { ...t, pinned: true } : t));
				set({ tabs: newTabs });
			},
			// Unpin tab
			unpinTab: (tabId: string) => {
				const { tabs } = get();
				const newTabs = tabs.map((t) => (t.id === tabId ? { ...t, pinned: false } : t));
				set({ tabs: newTabs });
			},
			clearTabs: () => {
				set({ tabs: [], activeTabId: '' });
			},
		}),
		{
			name: 'tabs-storage',
		}
	)
);
