function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	pageSize,
	onPageSizeChange,
	totalCount,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	pageSize: number;
	onPageSizeChange: (size: number) => void;
	totalCount: number;
}) {
	const getVisiblePages = () => {
		const delta = 2;
		const range = [];
		const rangeWithDots = [];

		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		if (currentPage - delta > 2) {
			rangeWithDots.push(1, '...');
		} else {
			rangeWithDots.push(1);
		}

		rangeWithDots.push(...range);

		if (currentPage + delta < totalPages - 1) {
			rangeWithDots.push('...', totalPages);
		} else {
			rangeWithDots.push(totalPages);
		}

		return rangeWithDots;
	};

	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalCount);

	return (
		<div className='z-10 bg-ctp-base px-6 py-4 border-ctp-surface0 border-t'>
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
