import Image from 'next/image';
import { FC } from 'react';
import { ISidebarHeaderProps } from './types';

const SidebarHeader: FC<ISidebarHeaderProps> = ({
	children,
	title = 'ServeMate',
	imgSrc = '/globe.svg',
}) => {
	return (
		<div className='flex items-center mb-6 pb-4 border-b border-ctp-surface0'>
			<Image src={`${imgSrc}`} alt={`${title} Logo`} width={30} height={30} />
			<h1 className='ml-2 text-xl font-bold text-ctp-mauve'>{title}</h1>
			{children}
		</div>
	);
};

export default SidebarHeader;
