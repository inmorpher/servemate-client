import { cn } from '@/shared/utils/classNames';
import { X } from 'lucide-react';
import { Button } from '../../button';
interface TabButtonProps {
	label: string;
	isActive?: boolean;
	onClose?: () => void;
	onClick: () => void;
}
export const TabButton = ({ label, isActive = false, onClose, onClick }: TabButtonProps) => {
	return (
		<div
			draggable='true'
			className={cn(
				'group ring-ctp-overlay0 focus-within:ring-ctp-blue relative flex h-8 min-w-41 items-center gap-1 rounded-lg px-2 ring-1 transition-all duration-300 in-[dragging]:cursor-grabbing',
				isActive ? 'bg-ctp-blue ring-ctp-blue' : 'bg-ctp-surface1 hover:bg-ctp-surface2',
			)}
		>
			<Button
				variant='unstyled'
				onClick={onClick}
				className='h-8 flex-1 justify-start px-2 text-left font-medium capitalize focus-visible:ring-0'
			>
				{label}
			</Button>
			{onClose && (
				<Button
					variant='unstyled'
					size='icon'
					onClick={(e) => {
						e.stopPropagation();
						onClose();
					}}
					className='h-8 opacity-0 transition-all duration-200 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:ring-1'
					aria-label='Close tab'
				>
					<X size={16} className='text-ctp-text' />
				</Button>
			)}
		</div>
	);
};
