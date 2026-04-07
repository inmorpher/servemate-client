'use client';

import useMediaQuery from './useMediaQuery';

interface UsePaginationParams {
	totalPages: number;
	currentPage: number;
}

const usePagination = ({ totalPages, currentPage }: UsePaginationParams) => {
	const isMobile = useMediaQuery('(max-width: 450px)'); // md breakpoint

	const getVisiblePages = () => {
		if (totalPages <= 1) {
			return [];
		}
		if (isMobile) {
			const delta = 1;
			const pages: number[] = [];
			const start = Math.max(1, currentPage - delta);
			const end = Math.min(totalPages, currentPage + delta);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
			return pages;
		}

		const pages: (number | string)[] = [];

		if (currentPage <= 4) {
			// Show first 4 pages: 1, 2, 3, 4, ..., last
			for (let i = 1; i <= Math.min(5, totalPages); i++) {
				pages.push(i);
			}
			// Add dots and last page if needed
			if (totalPages > 4) {
				pages.push('...');
				pages.push(totalPages);
			}
		} else if (currentPage >= totalPages - 3) {
			// Near end: show first, dots, and last 5 pages
			pages.push(1);
			if (totalPages > 7) {
				pages.push('...');
			}
			// Show at least the last 5 pages
			for (let i = Math.max(2, totalPages - 4); i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Middle: sliding window (current-1, current, current+1)
			pages.push(1);
			pages.push('...');

			const start = currentPage - 1;
			const end = currentPage + 1;

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			pages.push('...');
			pages.push(totalPages);
		}

		return pages;
	};

	return {
		isMobile,
		visiblePages: getVisiblePages(),
	};
};

export default usePagination;
