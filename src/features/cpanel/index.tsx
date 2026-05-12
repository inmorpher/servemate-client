'use client';

import { TabEntities } from '@/shared/components/tabs/types/tabs.type';
import React, { Activity, JSX, Suspense, ViewTransition } from 'react';
import { useTabs } from '../../shared/components/tabs/store/useTabs';

type TabComponentProps = {
	tabId: string;
};

const tabComponentMap: Record<
	TabEntities,
	React.LazyExoticComponent<(props: TabComponentProps) => JSX.Element>
> = {
	['users']: React.lazy(() => import('../users/ui/UserClientPage')),
	['orders']: React.lazy(() => import('../orders/ui/OrdersListPage')),
};

const CPanelIndex = () => {
	// const { tabs, activeTabId } = useTabs();
	const tabs = useTabs((state) => state.tabs);
	const activeTabId = useTabs((state) => state.activeTabId);

	return (
		<Suspense fallback={<div className='p-4'>Loading...</div>}>
			{tabs.map((tab) => {
				const isActive = activeTabId === tab.id;
				const Component = tabComponentMap[tab.entity];

				if (!Component) {
					return null;
				}

				return (
					<Activity key={tab.id} mode={isActive ? 'visible' : 'hidden'}>
						<ViewTransition>
							<Component tabId={tab.id} />
						</ViewTransition>
					</Activity>
				);
			})}
		</Suspense>
	);
};

export default CPanelIndex;
