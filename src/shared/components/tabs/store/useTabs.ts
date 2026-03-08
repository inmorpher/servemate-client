'use client';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Tab, TabsStore } from '../types/tabs.type';

const MAX_TABS = 10;
export const useTabs = create<TabsStore>()(
	devtools(
		persist(
			(set, get) => ({
				tabs: [],
				activeTabId: '',
				// Add tabs
				addTab: ({
					pinned,
					title,
					filters,
					entity,
					timestamp = Date.now(),
				}: Omit<Tab, 'id'>) => {
					const { tabs } = get();

					if (tabs.length >= MAX_TABS) {
						alert(`You can only have a maximum of ${MAX_TABS} tabs open at once.`);
						return;
					}

					const id = nanoid(8);

					set({
						tabs: [
							...tabs,
							{
								id: id,
								pinned: pinned ?? false,
								title,
								filters,
								entity,
								timestamp,
							},
						],
						activeTabId: id,
					});
				},
				// Remove tab
				removeTab: (tabId: string) => {
					const { tabs, activeTabId } = get();
					const tabIndex = tabs.findIndex((t) => t.id === tabId);
					const newTabs = tabs.filter((t) => t.id !== tabId);

					let newActiveTabId = activeTabId;

					// Если удаляемый таб был активным, ищем соседнего
					if (tabId === activeTabId) {
						if (newTabs.length > 0) {
							// Trying to activate the next tab, if it exists, otherwise the previous one
							if (tabIndex < newTabs.length) {
								newActiveTabId = newTabs[tabIndex].id;
							} else {
								// If it was the last one, take the previous one
								newActiveTabId = newTabs[newTabs.length - 1].id;
							}
						} else {
							newActiveTabId = '';
						}
					}

					set({ tabs: newTabs, activeTabId: newActiveTabId });
				},
				// Set active tab
				setActiveTab: (tabId: string) => {
					const { tabs } = get();
					const tab = tabs.find((t) => t.id === tabId);

					if (tab) {
						set({ activeTabId: tabId });
					}
				},
				// Get tab by ID
				getTabById: (tabId: string) => {
					const { tabs } = get();
					return tabs.find((t) => t.id === tabId);
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
				updateTab: (tabId: string, fields: Partial<Omit<Tab, 'id'>>) => {
					const { tabs } = get();
					// Filter out undefined values to prevent overwriting with undefined
					const cleanFields = Object.fromEntries(
						Object.entries(fields).filter(([_, value]) => value !== undefined),
					);
					const newTabs = tabs.map((t) =>
						t.id === tabId ? { ...t, ...cleanFields } : t,
					);
					set({ tabs: newTabs });
				},

				clearTabs: () => {
					set({ tabs: [], activeTabId: '' });
				},
			}),
			{
				name: 'tabs-storage',
			},
		),
	),
);
