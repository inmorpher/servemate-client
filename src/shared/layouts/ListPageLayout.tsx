'use client';

import { ReactNode, useState } from 'react';

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
	const [filtersVisible, setFiltersVisible] = useState(filtersOpen);

	return (
		<div className='relative flex'>
			{/* Filters panel - mobile overlay or desktop sidebar */}
			{Filters && (
				<div
					// style={{
					// 	transform: filtersVisible ? 'translateX(0) ' : 'translateX(-100%) ',
					// }}
					className={`fixed top-14.25 z-8 -translate-x-full transition-all duration-200 lg:sticky lg:translate-x-0`}
				>
					{Filters}
				</div>
			)}
			{/* Main content area */}
			<div className='flex min-w-0 flex-1 flex-col rounded-2xl'>
				{Content && <main className='p-2 md:px-6'>{Content}</main>}
				{Footer && (
					<footer className='border-ctp-surface1 bg-ctp-surface0 sticky bottom-0 shrink-0 border-t md:px-6 md:py-4'>
						{Footer}
					</footer>
				)}
			</div>
		</div>
	);
};
