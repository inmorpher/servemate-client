'use client';

import { TabEntities } from '@/shared/components/tabs/types/tabs.type';
import React, { Activity, Fragment, JSX, Suspense } from 'react';
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
	const { tabs, activeTabId } = useTabs();

	return (
		<>
			<Suspense fallback={<div className='p-4'>Loading...</div>}>
				{tabs.map((tab) => {
					const isActive = activeTabId === tab.id;
					const Component = tabComponentMap[tab.entity];

					return Component ? (
						<Fragment key={tab.id}>
							<Activity mode={isActive ? 'visible' : 'hidden'}>
								<Component tabId={tab.id} />
							</Activity>
						</Fragment>
					) : null;
				})}
			</Suspense>
		</>
	);
};

export default CPanelIndex;
