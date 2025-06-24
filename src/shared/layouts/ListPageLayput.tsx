import { ReactNode } from 'react';

interface ListPageLayoutProps {
	header: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
}

export const ListPageLayout = ({ header, children, footer }: ListPageLayoutProps) => {
	return (
		<div className='relative bg-ctp-base h-full flex flex-col'>
			<header className='flex-shrink-0 bg-ctp-base' role='banner'>
				{header}
			</header>
			<main className='flex-1 p-6 overflow-auto bg-ctp-surface1 rounded-2xl' role='main'>
				{children}
			</main>

			<footer className='flex-shrink-0' role='contentinfo'>
				{footer}
			</footer>
		</div>
	);
};
