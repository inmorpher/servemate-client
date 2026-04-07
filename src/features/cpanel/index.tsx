'use client';

import { TabEntities } from '@/shared/components/tabs/types/tabs.type';
import React, { Activity, Fragment, JSX, Suspense, ViewTransition } from 'react';
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
		<>
			{/* <TabsHorizontal /> */}
			<Suspense fallback={<div className='p-4'>Loading...</div>}>
				{tabs.map((tab) => {
					const isActive = activeTabId === tab.id;
					const Component = tabComponentMap[tab.entity];

					return Component ? (
						<Fragment key={tab.id}>
							<ViewTransition>
								<Activity mode={isActive ? 'visible' : 'hidden'}>
									<Component tabId={tab.id} />
								</Activity>
							</ViewTransition>
						</Fragment>
					) : null;
				})}
			</Suspense>
		</>
	);
};

export default CPanelIndex;
