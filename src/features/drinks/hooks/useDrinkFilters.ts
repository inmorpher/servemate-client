'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useEffect, useRef, useState } from 'react';
import type { DrinkSearchCriteria } from '../types';

type TextFilterKey = 'name' | 'category';

const textFilterKeys: TextFilterKey[] = ['name', 'category'];

export const useDrinkFilters = (tabId: Tab['id']) => {
	const currentTab = useTabs((state) => state.getTabById(tabId)) as
		| Tab<DrinkSearchCriteria>
		| undefined;
	const filters = currentTab?.filters;
	const [nameValue, setNameValue] = useState(filters?.name ?? '');
	const [categoryValue, setCategoryValue] = useState(filters?.category ?? '');
	const textFilterTimers = useRef<Partial<Record<TextFilterKey, ReturnType<typeof setTimeout>>>>(
		{},
	);

	const updateFilters = (patch: Partial<DrinkSearchCriteria>) => {
		const store = useTabs.getState();
		const tab = store.getTabById(tabId) as Tab<DrinkSearchCriteria> | undefined;
		if (!tab) {
			return;
		}

		store.updateTab(tabId, {
			filters: {
				...(tab.filters ?? {}),
				...patch,
				page: 1,
			},
		});
	};

	const scheduleTextFilter = (key: TextFilterKey, value: string) => {
		const existingTimer = textFilterTimers.current[key];
		if (existingTimer !== undefined) {
			clearTimeout(existingTimer);
		}

		textFilterTimers.current[key] = setTimeout(() => {
			const nextValue = value.trim() || undefined;
			updateFilters({ [key]: nextValue } as Partial<DrinkSearchCriteria>);
		}, 300);
	};

	useEffect(() => {
		setNameValue(filters?.name ?? '');
	}, [filters?.name, tabId]);

	useEffect(() => {
		setCategoryValue(filters?.category ?? '');
	}, [filters?.category, tabId]);

	useEffect(
		() => () => {
			textFilterKeys.forEach((key) => {
				const timer = textFilterTimers.current[key];
				if (timer !== undefined) {
					clearTimeout(timer);
				}
			});
		},
		[],
	);

	const handleClearFilters = () => {
		textFilterKeys.forEach((key) => {
			const timer = textFilterTimers.current[key];
			if (timer !== undefined) {
				clearTimeout(timer);
				delete textFilterTimers.current[key];
			}
		});
		setNameValue('');
		setCategoryValue('');
		useTabs.getState().clearFilters(tabId);
	};

	const handleNameChange = (value: string) => {
		setNameValue(value);
		scheduleTextFilter('name', value);
	};

	const handleCategoryChange = (value: string) => {
		setCategoryValue(value);
		scheduleTextFilter('category', value);
	};

	const handleAvailabilityChange = (value: string) => {
		updateFilters({ isAvailable: value === '' ? undefined : value === 'true' });
	};

	const handleVolumeChange = (value: string) => {
		updateFilters({ volume: value === '' ? undefined : Number(value) });
	};

	const hasFilters = Boolean(
		nameValue.trim() ||
		categoryValue.trim() ||
		filters?.isAvailable !== undefined ||
		filters?.volume !== undefined,
	);

	return {
		filters,
		nameValue,
		categoryValue,
		handleNameChange,
		handleCategoryChange,
		handleAvailabilityChange,
		handleVolumeChange,
		handleClearFilters,
		hasFilters,
	};
};
