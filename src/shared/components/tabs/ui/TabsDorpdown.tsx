'use client';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { startTransition } from 'react';
import { useTabs } from '../store/useTabs';
import { TabItem } from './TabItem';

type TabsDropdownProps = {
	isMobile?: boolean;
};

export const TabsDropdown = ({ isMobile = false }: TabsDropdownProps) => {
	const { tabs, activeTabId, setActiveTab, removeTab } = useTabs();

	const isMobileClasses = isMobile ? 'lg:hidden' : '';
	return (
		<Popover>
			<PopoverTrigger className={`w-full ${isMobileClasses}`} asChild>
				<div className='text-ctp-text hover:bg-ctp-surface2 border-ctp-surface2 flex w-full items-center justify-between rounded-md border px-4 py-2'>
					<span className='font-medium'>Select Tab</span>
					<span>▼</span>
				</div>
			</PopoverTrigger>
			<PopoverContent
				className={`corner-squircle bg-ctp-surface2/30 $ rounded-2xl border-0 p-2 ring-1 ring-white/10 backdrop-blur-xl ${isMobileClasses}`}
				side='top'
				align='end'
			>
				<div className='flex flex-col gap-2'>
					{tabs.map((tab) => (
						<TabItem
							key={'tab-' + tab.id}
							tab={tab}
							isActive={tab.id === activeTabId}
							onSelect={() => {
								startTransition(() => {
									setActiveTab(tab.id);
								});
							}}
							classNames='h-10 text-xl'
							onClose={() => removeTab(tab.id)}
						/>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
};
