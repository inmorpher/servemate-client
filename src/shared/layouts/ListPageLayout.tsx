'use client';

import { ReactNode } from 'react';

interface ListPageLayoutProps {
	Filters?: ReactNode;
	Content?: ReactNode;
	Footer?: ReactNode;
	filtersOpen?: boolean;
}

export const ListPageLayout = ({
	Filters,
	Content,
	Footer,
	filtersOpen = true,
}: ListPageLayoutProps) => {
	return (
		<div className='h-[calc(100vh-theme(height.14.25))] relative flex'>
			{/* Filters panel - mobile overlay or desktop sidebar */}
			{Filters && (
				<div
					className={`fixed top-14.25 z-8 -translate-x-full transition-all duration-200 lg:sticky lg:translate-x-0`}
				>
					{Filters}
				</div>
			)}
			{/* Main content area */}
			<main className='flex min-w-0 flex-1 flex-col overflow-hidden'>
				{Content && (
					<section className='flex-1 overflow-y-auto p-2 md:px-6'>{Content}</section>
				)}
				{Footer && (
					<footer className='bg-ctp-surface0 shrink md:px-6 md:py-4'>{Footer}</footer>
				)}
			</main>
		</div>
	);
};
