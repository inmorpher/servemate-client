'use client';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/popover';
import { useState } from 'react';
import { useTabs } from '../store/useTabs';
import { TabItem } from './TabItem';

type TabsDropdownProps = {
	isMobile?: boolean;
};

export const TabsDropdown = ({ isMobile = false }: TabsDropdownProps) => {
	const { tabs, activeTabId, setActiveTab, removeTab, getTabById } = useTabs();
	const activeTab = getTabById(activeTabId);
	const [isOpen, setIsOpen] = useState(false);

	const handleSelectTab = (tabId: string) => {
		setActiveTab(tabId);
		setIsOpen(false); // ← Закрыть popover после выбора
	};

	const isMobileClasses = isMobile ? 'lg:hidden' : '';
	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger className={`w-1/2 ${isMobileClasses}`} asChild>
				<div className='text-ctp-text hover:bg-ctp-surface2 border-ctp-base sticky top-0 left-0 flex items-center justify-between rounded-md border px-4 py-2'>
					<span className='font-medium capitalize'>
						{activeTab ? activeTab?.title : 'Select Tab'}
					</span>
					<span>▼</span>
				</div>
			</PopoverTrigger>
			<PopoverContent
				className={`corner-squircle bg-ctp-surface2/30 $ rounded-2xl border-0 p-2 ring-1 ring-white/10 backdrop-blur-xl ${isMobileClasses}`}
				side='bottom'
				align='end'
				sideOffset={15}
			>
				<div className='flex flex-col gap-2'>
					{tabs.map((tab) => (
						<TabItem
							key={'tab-' + tab.id}
							tab={tab}
							isActive={tab.id === activeTabId}
							onSelect={() => {
								handleSelectTab(tab.id);
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
