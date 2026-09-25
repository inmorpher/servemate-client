'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';
import type { Tab } from '@/shared/components/tabs/types/tabs.type';
import { useEffect, useRef, useState } from 'react';
import type { FoodSearchCriteria } from '../types';

type TextFilterKey = 'name' | 'category' | 'type';
type DietaryFilterKey = 'isVegan' | 'isGlutenFree' | 'isVegetarian';

const textFilterKeys: TextFilterKey[] = ['name', 'category', 'type'];

export const useFoodFilters = (tabId: Tab['id']) => {
	const currentTab = useTabs((state) => state.getTabById(tabId)) as
		| Tab<FoodSearchCriteria>
		| undefined;
	const filters = currentTab?.filters;
	const [nameValue, setNameValue] = useState(filters?.name ?? '');
	const [categoryValue, setCategoryValue] = useState(filters?.category ?? '');
	const [typeValue, setTypeValue] = useState(filters?.type ?? '');
	const textFilterTimers = useRef<Partial<Record<TextFilterKey, ReturnType<typeof setTimeout>>>>(
		{},
	);

	const updateFilters = (patch: Partial<FoodSearchCriteria>) => {
		const store = useTabs.getState();
		const tab = store.getTabById(tabId) as Tab<FoodSearchCriteria> | undefined;
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
			updateFilters({ [key]: nextValue } as Partial<FoodSearchCriteria>);
		}, 300);
	};

	useEffect(() => {
		setNameValue(filters?.name ?? '');
	}, [filters?.name, tabId]);

	useEffect(() => {
		setCategoryValue(filters?.category ?? '');
	}, [filters?.category, tabId]);

	useEffect(() => {
		setTypeValue(filters?.type ?? '');
	}, [filters?.type, tabId]);

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
		setTypeValue('');
		useTabs.getState().clearFilters(tabId);
	};

	const handleTextFilterChange = (key: TextFilterKey, value: string) => {
		if (key === 'name') {
			setNameValue(value);
		} else if (key === 'category') {
			setCategoryValue(value);
		} else {
			setTypeValue(value);
		}
		scheduleTextFilter(key, value);
	};

	const handleAvailabilityChange = (value: string) => {
		updateFilters({ isAvailable: value === '' ? undefined : value === 'true' });
	};

	const handlePriceChange = (value: string) => {
		updateFilters({ price: value === '' ? undefined : Number(value) });
	};

	const handleDietaryChange = (key: DietaryFilterKey, checked: boolean) => {
		updateFilters({ [key]: checked ? true : undefined });
	};

	const hasFilters = Boolean(
		nameValue.trim() ||
		categoryValue.trim() ||
		typeValue.trim() ||
		filters?.isAvailable !== undefined ||
		filters?.price !== undefined ||
		filters?.isVegan !== undefined ||
		filters?.isGlutenFree !== undefined ||
		filters?.isVegetarian !== undefined,
	);

	return {
		filters,
		nameValue,
		categoryValue,
		typeValue,
		handleTextFilterChange,
		handleAvailabilityChange,
		handlePriceChange,
		handleDietaryChange,
		handleClearFilters,
		hasFilters,
	};
};
