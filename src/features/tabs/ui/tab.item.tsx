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
				'flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all duration-200 border-2 cursor-pointer corner-squircle shadow-2xs shadow-amber-300',
				isActive
					? 'bg-ctp-surface0 text-ctp-text border-ctp-blue'
					: 'bg-ctp-base text-ctp-subtext0 border-transparent hover:bg-ctp-surface1'
			)}
			onClick={() => onSelect(tab.id)}
		>
			<button className='flex-1 text-sm font-medium truncate text-left hover:text-cpt-text transition-colors'>
				{tab.title}
			</button>

			<button
				onClick={(event) => {
					event.stopPropagation();
					onClose(tab.id);
				}}
				className={cn(
					'p-1 rounded transition-all duration-200',
					isActive
						? 'hover:bg-ctp-surface1 text-ctp-text'
						: 'hover:bg-ctp-surface2 text-ctp-subtext1'
				)}
				title='Close Tab'
			>
				<X size={16} />
			</button>
		</div>
	);
};
