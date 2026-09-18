'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';
import { TabEntities } from '@/shared/components/tabs/types/tabs.type';

interface UseSidebarNavigationParams {
	entity: TabEntities;
	label: string;
	href?: string;
}

export const useSidebarNavigation = () => {
	const { addTab } = useTabs();

	const navigateToItem = ({ entity, label }: UseSidebarNavigationParams) => {
		addTab({ title: label, entity });
	};

	return { navigateToItem };
};
