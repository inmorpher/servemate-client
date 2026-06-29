'use client';

import { FiltersPortalContext } from '@/app/(protected)/layout';
import { ReactNode, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Drawer } from '../components/drawer';
import useMediaQuery from '../hooks/useMediaQuery';

interface ListPageLayoutProps {
	filters?: ReactNode;
	content: ReactNode;
	footer?: ReactNode;
}
export function ListPageLayout({ filters, content, footer }: ListPageLayoutProps) {
	const [filtersOpen, setFiltersOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width: 1024px)');
	const { target } = useContext(FiltersPortalContext);

	const toggleFilters = () => setFiltersOpen((prev) => !prev);

	const filtersRef = useRef<HTMLElement>(null);

	const filtersPanel =
		!isMobile && filters && target
			? createPortal(
					<aside
						aria-label='Filters'
						className='border-ctp-surface1 bg-ctp-surface0/80 sticky top-14 hidden h-[calc(100vh-3.5625rem)] w-80 shrink-0 scrollbar-thin self-start overflow-y-scroll p-4 shadow-sm lg:block'
					>
						<div className='space-y-4'>{filters}</div>
					</aside>,
					target,
				)
			: null;

	return (
		<>
			{isMobile && filters ? (
				<Drawer
					id='filters-drawer'
					isOpen={filtersOpen}
					onOpenChange={toggleFilters}
					direction='right'
					size='auto'
					className='bg-ctp-surface0 overflow-y-auto px-4 pt-20 pb-20'
				>
					{filters}
				</Drawer>
			) : null}

			<div className='flex min-h-0 flex-1 overflow-hidden'>
				<main className='flex min-h-[calc(100vh-3.5625rem)] flex-1 flex-col overflow-hidden'>
					<section className='min-h-0 flex-1 overflow-y-auto'>
						<div className='p-2 md:px-6'>{content}</div>
					</section>

					{footer ? <footer className='shrink-0 md:px-6 md:py-4'>{footer}</footer> : null}
				</main>

				{filtersPanel}
			</div>
		</>
	);
}
