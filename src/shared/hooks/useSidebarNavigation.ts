'use client';

import { useTabs } from '@/shared/components/tabs/store/useTabs';

interface UseSidebarNavigationParams {
	entity: string;
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
