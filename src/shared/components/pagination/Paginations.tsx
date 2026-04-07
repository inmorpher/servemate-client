'use client';

import usePagination from '@/shared/hooks/usePagiation';

interface PaginationProps {
	totalCount: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
}

function Pagination({
	totalCount = 0,
	totalPages = 1,
	currentPage = 1,
	pageSize = 10,
	onPageChange = () => {},
	onPageSizeChange = () => {},
}: PaginationProps) {
	const { visiblePages } = usePagination({ totalPages, currentPage });

	return (
		<nav className='z-10 px-6 py-4' aria-label='Pages navigation' role='navigation'>
			<div className='flex flex-wrap-reverse items-center justify-center gap-2'>
				<div className='flex items-center gap-4'>
					{totalCount > 0 && (
						<span className='text-ctp-subtext0 text-sm'>
							{/* {`Shown ${startItem}-${endItem} from ${totalCount}`} */}
						</span>
					)}

					<select
						value={pageSize}
						onChange={(e) => onPageSizeChange(Number(e.target.value))}
						aria-label='Select number of items per page'
						className='bg-ctp-surface0 border-ctp-surface1 focus:ring-ctp-blue text-ctp-text rounded border px-2 py-1 text-sm focus:ring-2 focus:outline-none'
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
					</select>
				</div>

				<div className='flex items-center gap-1'>
					{/* Previous Page Button */}
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage <= 1}
						aria-label={`Navigate to the previous page (${currentPage - 1})`}
						aria-disabled={currentPage <= 1}
						className='bg-ctp-surface0 hover:bg-ctp-surface1 border-ctp-surface1 text-ctp-text corner-squircle rounded-lg border px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50'
					>
						←
					</button>
					{/* Page Numbers */}
					{visiblePages.map((page, index) => (
						<button
							key={String(page) + '-' + index}
							onClick={() => typeof page === 'number' && onPageChange(page)}
							disabled={page === '...'}
							aria-label={
								typeof page === 'number'
									? `Page ${page}${page === currentPage ? ' (current)' : ''}`
									: undefined
							}
							aria-current={page === currentPage ? 'page' : undefined}
							aria-disabled={page === '...'}
							className={`corner-squircle w-8 rounded-2xl border py-1 text-center text-sm transition-colors ${
								page === currentPage
									? 'bg-ctp-blue text-ctp-base border-ctp-blue'
									: 'bg-ctp-surface0 text-ctp-text border-ctp-surface1 hover:bg-ctp-surface1'
							} ${page === '...' ? 'cursor-default' : 'cursor-pointer'}`}
						>
							{page}
						</button>
					))}
					{/* Next Page Button */}
					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage >= totalPages}
						aria-label={`Navigate to the next page (${currentPage + 1})`}
						aria-disabled={currentPage >= totalPages}
						className='bg-ctp-surface0 hover:bg-ctp-surface1 border-ctp-surface1 text-ctp-text corner-squircle rounded-lg border px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50'
					>
						→
					</button>
				</div>
			</div>
		</nav>
	);
}

export default Pagination;
