'use client';

import { ReactNode, useState } from 'react';

interface ListPageLayoutProps {
	renderFilters?: () => ReactNode;
	renderFiltersToggle?: () => ReactNode;
	renderFooter?: () => ReactNode;
	renderContent: () => ReactNode;
	filtersOpen?: boolean;
}

export const ListPageLayout = ({
	renderFilters,
	renderFiltersToggle,
	renderFooter,
	renderContent,
	filtersOpen = true,
}: ListPageLayoutProps) => {
	const [filtersVisible, setFiltersVisible] = useState(filtersOpen);

	return (
		<div className='relative flex'>
			{filtersVisible} {/* Filters panel - mobile overlay or desktop sidebar */}
			{renderFilters && (
				<div
					style={{
						transform: filtersVisible ? 'translateX(0) ' : 'translateX(-100%) ',
					}}
					className={`bg-ctp-base fixed top-14.25 z-8 -translate-x-full transition-all duration-200 lg:sticky lg:translate-x-0`}
				>
					{renderFilters()}
				</div>
			)}
			{/* Main content area */}
			<div className='flex min-w-0 flex-1 flex-col rounded-2xl'>
				<button
					className='block h-2 w-2.5 cursor-cell p-6 pb-0'
					onClick={(event) => {
						event.stopPropagation();
						console.log('toggle filters', filtersVisible);
						setFiltersVisible(!filtersVisible);
					}}
				>
					{'toggler'}
				</button>

				{renderContent && <main className='p-2 md:p-6'>{renderContent()}</main>}
				{renderFooter && (
					<footer className='border-ctp-surface1 bg-ctp-surface0 sticky bottom-0 shrink-0 border-t md:px-6 md:py-4'>
						{renderFooter()}
					</footer>
				)}
			</div>
		</div>
	);
};
