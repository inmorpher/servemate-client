'use client';

import { ReactElement, ReactNode, useState } from 'react';
import { Drawer } from '../components/drawer';
import useMediaQuery from '../hooks/useMediaQuery';

type ListPageLayoutChild =
	| ReactElement<FiltersProps, typeof Filters>
	| ReactElement<ContentProps, typeof Content>
	| ReactElement<FooterProps, typeof Footer>;

interface ListPageLayoutProps {
	children: ListPageLayoutChild | ListPageLayoutChild[];
}

const isFilters = (
	child: ReactElement<unknown>,
): child is ReactElement<FiltersProps, typeof Filters> => child.type === Filters;

const isContent = (
	child: ReactElement<unknown>,
): child is ReactElement<ContentProps, typeof Content> => child.type === Content;

const isFooter = (
	child: ReactElement<unknown>,
): child is ReactElement<FooterProps, typeof Footer> => child.type === Footer;

const ListPageLayoutRoot = ({ children }: ListPageLayoutProps) => {
	const [filtersOpen, setFiltersOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width: 1024px)');

	const childrenArray = Array.isArray(children) ? children : [children];

	const filters = childrenArray.find(isFilters);
	const content = childrenArray.find(isContent);
	const footer = childrenArray.find(isFooter);

	const onChangeFiltersHandler = () => {
		setFiltersOpen((prev) => !prev);
	};

	const filtersWithAside = filters ? (
		<aside className='lg:bg-ctp-surface0 sticky top-14.25 z-20 h-screen w-full overflow-x-hidden overflow-y-auto p-2 py-10 md:h-[calc(100vh-3.5625rem)] md:overflow-y-auto md:py-2 lg:w-70'>
			{filters}
		</aside>
	) : null;

	return (
		<>
			{isMobile && (
				<Drawer
					id='filters'
					isOpen={filtersOpen}
					onOpenChange={onChangeFiltersHandler}
					direction='right'
					size='auto'
					className='bg-ctp-surface0 overflow-y-auto px-4 pt-20 pb-20'
				>
					{filters}
				</Drawer>
			)}

			<div className='relative flex'>
				{/* Фильтры показываются только на десктопе */}
				{!isMobile && filtersWithAside}

				{/* Content + Footer вместе в колоне */}
				<div className='flex min-w-0 flex-1 flex-col'>
					{/* Show Filters button - mobile only */}
					{isMobile && filters && (
						<button
							onClick={onChangeFiltersHandler}
							className='border-ctp-surface1 bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1 active:bg-ctp-surface2 flex items-center gap-2 border-b px-4 py-3 text-sm font-medium transition-colors'
							aria-label='Toggle filters panel'
							aria-expanded={filtersOpen}
							aria-controls='filters-panel'
						>
							<svg
								width='18'
								height='18'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='shrink'
							>
								<polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' />
							</svg>
							<span>Show Filters</span>
						</button>
					)}
					{content}
					{footer}
				</div>
			</div>
		</>
	);
};

interface FiltersProps {
	children: ReactNode;
}
const Filters = ({ children }: FiltersProps) => {
	return <>{children}</>;
};

Filters.displayName = 'ListPageLayout.Filters';

interface ContentProps {
	children: ReactNode;
}

const Content = ({ children }: ContentProps) => {
	return (
		<main className='flex min-w-0 flex-1 flex-col overflow-hidden'>
			<section className='flex-1 overflow-y-auto p-2 md:px-6'>{children}</section>
		</main>
	);
};

Content.displayName = 'ListPageLayout.Content';

interface FooterProps {
	children: ReactNode;
}

const Footer = ({ children }: FooterProps) => {
	return <footer className='bg-ctp-surface0 shrink-0 md:px-6 md:py-4'>{children}</footer>;
};

Footer.displayName = 'ListPageLayout.Footer';

export const ListPageLayout = Object.assign(ListPageLayoutRoot, {
	Filters,
	Content,
	Footer,
});
