'use client';

import { ReactNode } from 'react';

interface ListPageLayoutProps {
	renderFilters?: () => ReactNode;
	renderFooter?: () => ReactNode;
	renderContent: () => ReactNode;
}

// export const ListPageLayout = ({ children, footer, filters }: ListPageLayoutProps) => {
// 	return (
// 		<div className='flex h-full relative'>
// 			<div className='relative bg-ctp-base h-full flex flex-col flex-grow overflow-x-hidden'>
// 				<main className='flex-1 p-6 overflow-hidden bg-ctp-surface1 rounded-2xl'>{children}</main>
// 				{footer && <footer className='flex-shrink-0'>{footer}</footer>}
// 			</div>
// 			{filters && filters}
// 		</div>
// 	);
// };

export const ListPageLayout = ({
	renderFilters,
	renderFooter,
	renderContent,
}: ListPageLayoutProps) => {
	return (
		<div className='flex gap-4'>
			{/* Main content area */}
			<div className='bg-ctp-surface0 flex min-w-0 flex-1 flex-col rounded-2xl'>
				{renderContent && <main className='p-6'>{renderContent()}</main>}
				{renderFooter && (
					<footer className='border-ctp-surface1 bg-ctp-surface0 sticky bottom-0 shrink-0 border-t px-6 py-4'>
						{renderFooter()}
					</footer>
				)}
			</div>

			{/* Right sidebar filters — sticky */}
			{renderFilters && renderFilters()}
		</div>
	);
};
