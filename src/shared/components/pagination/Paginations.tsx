'use client';

interface PaginationProps {
	totalCount: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

function Pagination({ 
	totalCount = 0, 
	totalPages = 1, 
	currentPage = 1, 
	pageSize = 10, 
	onPageChange, 
	onPageSizeChange 
}: PaginationProps) {
	const getVisiblePages = () => {
		if (totalPages <= 1) {
			return [];
		}
		const delta = 2;
		const range = [];
		const rangeWithDots: (number | string)[] = [];

		// Add first page if not in direct range
		if (currentPage - delta > 2) {
			rangeWithDots.push(1, '...');
		} else {
			for (let i = 1; i < currentPage - delta; i++) {
				if (i < 2) rangeWithDots.push(i);
			}
		}

		for (
			let i = Math.max(1, currentPage - delta);
			i <= Math.min(totalPages, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		rangeWithDots.push(...range);

		if (currentPage + delta < totalPages - 1) {
			rangeWithDots.push('...', totalPages);
		} else if (currentPage + delta < totalPages) {
			rangeWithDots.push(totalPages);
		}

		// Deduplicate and ensure first and last pages are included if necessary
		const finalPages = Array.from(new Set(rangeWithDots));
		if (!finalPages.includes(1) && totalPages > 0) finalPages.unshift(1);
		if (!finalPages.includes(totalPages) && totalPages > 1) finalPages.push(totalPages);

		// Correctly handle dots logic
		const pagesWithCorrectDots: (string | number)[] = [];
		let lastPage: number | string | null = null;
		for (const page of finalPages) {
			if (lastPage !== null && typeof page === 'number' && typeof lastPage === 'number' && page > lastPage + 1) {
				pagesWithCorrectDots.push('...');
			}
			pagesWithCorrectDots.push(page);
			lastPage = page;
		}

		// Filter out initial dots if page 1 is present
		if (pagesWithCorrectDots[0] === 1 && pagesWithCorrectDots[1] === '...' && pagesWithCorrectDots[2] === 2) {
			pagesWithCorrectDots.splice(1, 1);
		}

		return pagesWithCorrectDots.filter((p, i, arr) => p !== '...' || arr[i-1] !== p);
	};

	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalCount);

	return (
		<div className='z-10 bg-ctp-base px-6 py-4 '>
			<div className='flex flex-wrap-reverse justify-center items-center gap-2'>
				<div className='flex items-center gap-4'>
					<span className='text-ctp-subtext0 text-sm'>
						Shown {startItem}-{endItem} from {totalCount}
					</span>

					<select
						value={pageSize}
						onChange={(e) => onPageSizeChange(Number(e.target.value))}
						className='bg-ctp-surface0 px-2 py-1 border border-ctp-surface1 rounded focus:outline-none focus:ring-2 focus:ring-ctp-blue text-ctp-text text-sm'
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
					</select>
				</div>

				<div className='flex items-center gap-1'>
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage <= 1}
						className='bg-ctp-surface0 hover:bg-ctp-surface1 disabled:opacity-50 px-3 py-1 border border-ctp-surface1 rounded text-ctp-text text-sm transition-colors disabled:cursor-not-allowed'
					>
						←
					</button>

					{getVisiblePages().map((page, index) => (
						<button
							key={index}
							onClick={() => typeof page === 'number' && onPageChange(page)}
							disabled={page === '...'}
							className={`px-3 py-1 text-sm border rounded transition-colors ${
								page === currentPage
									? 'bg-ctp-blue text-ctp-base border-ctp-blue'
									: 'bg-ctp-surface0 text-ctp-text border-ctp-surface1 hover:bg-ctp-surface1'
							} ${page === '...' ? 'cursor-default' : 'cursor-pointer'}`}
						>
							{page}
						</button>
					))}

					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage >= totalPages}
						className='bg-ctp-surface0 hover:bg-ctp-surface1 disabled:opacity-50 px-3 py-1 border border-ctp-surface1 rounded text-ctp-text text-sm transition-colors disabled:cursor-not-allowed'
					>
						→
					</button>
				</div>
			</div>
		</div>
	);
}

export default Pagination;
