'use client';

import { ReactNode } from 'react';

interface ListPageLayoutProps {
	children: ReactNode;
	footer?: ReactNode;
	filters?: ReactNode;
}

export const ListPageLayout = ({ children, footer, filters }: ListPageLayoutProps) => {
	return (
		<div className='flex h-full relative'>
			<div className='relative bg-ctp-base h-full flex flex-col flex-grow overflow-x-hidden'>
				<main className='flex-1 p-6 overflow-hidden bg-ctp-surface1 rounded-2xl'>{children}</main>
				{footer && <footer className='flex-shrink-0'>{footer}</footer>}
			</div>
			{filters && filters}
		</div>
	);
};
