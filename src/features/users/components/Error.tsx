interface SearchErrorProps {
	error?: string;
	refetch: () => void;
}

function SearchError({ error, refetch }: SearchErrorProps) {
	return (
		<div className='flex justify-center items-center bg-ctp-base min-h-screen'>
			<div className='text-center'>
				<div className='mb-4 text-ctp-red'>
					<svg className='mx-auto w-16 h-16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
				</div>
				<h2 className='mb-2 font-semibold text-ctp-text text-xl'>Loading error</h2>
				{error && <p className='mb-4 text-ctp-subtext0'>{error}</p>}

				<button
					onClick={() => refetch()}
					className='bg-ctp-blue hover:bg-ctp-sapphire px-4 py-2 rounded-lg text-ctp-base transition-colors'
				>
					Try again
				</button>
			</div>
		</div>
	);
}

export default SearchError;
