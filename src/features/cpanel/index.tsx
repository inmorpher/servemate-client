'use client';

import { Activity, Suspense, ViewTransition } from 'react';
import { OrdersListPage } from '../orders/ui/OrdersListPage';
import { useTabs } from '../tabs/store/useTabs';
import { UserClientPage } from '../users/ui/UserClientPage';

enum CPanelTabs {
	USERS = 'users',
	ACCAUNT = 'accaunt',
	DASHBOARD = 'dashboard',
	ORDERS = 'orders',
}

const CPanelIndex = () => {
	const { tabs, activeTabId } = useTabs();

	return (
		<>
			<Suspense fallback={<div className='p-4'>Loading...</div>}>
				<ViewTransition>
					{tabs.map((tab) => {
						const isActive = activeTabId === tab.id;
						return (
							<Activity
								// если tab.id пока = "orders", тогда лучше сделать key уникальным через path
								key={tab.id}
								mode={activeTabId === tab.id ? 'visible' : 'hidden'}
							>
								<div
									style={{
										height: '100%',
										width: '100%',
										viewTransitionName: isActive
											? 'active-tab-cointent'
											: 'none',
									}}
								>
									{tab.entity === CPanelTabs.ORDERS && (
										<OrdersListPage tabId={tab.id} filters={tab.filters} />
									)}
									{tab.entity === CPanelTabs.USERS && (
										<UserClientPage tabId={tab.id} />
									)}
								</div>
							</Activity>
						);
					})}
				</ViewTransition>
			</Suspense>
		</>
	);
};

export default CPanelIndex;
