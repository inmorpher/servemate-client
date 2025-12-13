import { cn } from '@/shared/utils/classNames';
import { X } from 'lucide-react';
import { Tab } from '../types/tabs.type';

type TabItemProps = {
	tab: Tab;
	isActive: boolean;
	onSelect: (tabId: string) => void;
	onClose: (tabId: string) => void;
};

export const TabItem = ({ tab, isActive, onSelect, onClose }: TabItemProps) => {
	return (
		<div
			className={cn(
				'corner-squircle gap-1/2 mx-1 flex cursor-pointer items-center rounded-lg px-2 py-1 transition-all duration-300',
				isActive
					? 'bg-ctp-surface0 text-ctp-text border-ctp-blue ring-ctp-blue ring-1'
					: 'bg-ctp-base text-ctp-subtext0 hover:bg-ctp-surface1 border-transparent',
			)}
			onClick={() => onSelect(tab.id)}
		>
			<button className='hover:text-cpt-text flex-1 truncate text-left text-sm font-medium transition-colors'>
				{tab.title}
			</button>

			<button
				onClick={(event) => {
					event.stopPropagation();
					onClose(tab.id);
				}}
				className={cn(
					'rounded p-1 transition-all duration-200',
					isActive
						? 'hover:bg-ctp-surface1 text-ctp-text'
						: 'hover:bg-ctp-surface2 text-ctp-subtext',
				)}
				title='Close Tab'
			>
				<X size={16} />
			</button>
		</div>
	);
};
