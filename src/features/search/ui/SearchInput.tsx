interface SearchInputProps {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	isLoading?: boolean;
	placeholder?: string;
}

/**
 * Renders a search input component with an integrated search icon and a submit button.
 *
 * @remarks
 * - The input field is styled with Tailwind CSS classes and displays a search icon inside the input.
 * - The submit button displays a loading spinner and "Searching..." text when `isLoading` is true, otherwise shows a search icon and "Find".
 * - The button is disabled while loading.
 * - This component should be used within a `SearchWrapper` or a form container to handle submission and layout.
 *
 * @param value - The current value of the search input.
 * @param onChange - Callback function invoked when the input value changes. Receives the input change event.
 * @param isLoading - Boolean indicating whether a search operation is in progress.
 *
 * @returns A React functional component rendering a styled search input and submit button.
 *
 * @example
 * ```tsx
 * <SearchWrapper>
 *   <SearchInput
 *     value={searchTerm}
 *     onChange={handleSearchChange}
 *     isLoading={isSearching}
 *   />
 * </SearchWrapper>
 * ```
 */
export const SearchInput = ({ value, onChange, isLoading, placeholder }: SearchInputProps) => {
	return (
		<div className='flex items-center gap-3'>
			<div className='relative flex-grow'>
				<input
					type='text'
					name='search'
					placeholder={placeholder || 'Search...'}
					aria-label='Search input'
					value={value}
					onChange={(event) => onChange(event)}
					className='w-full px-4 py-2 pl-10 text-sm bg-ctp-surface0 border border-ctp-surface1 rounded-lg text-ctp-text placeholder-ctp-subtext0 focus:outline-none focus:ring-2 focus:ring-ctp-blue focus:border-transparent'
				/>
				<svg
					className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ctp-subtext0'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
					/>
				</svg>
			</div>

			<button
				type='submit'
				disabled={isLoading}
				className='px-4 py-2 bg-ctp-blue text-ctp-base text-sm font-medium rounded-lg hover:bg-ctp-sapphire disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
			>
				{isLoading ? (
					<>
						<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-ctp-base'></div>
						<span>Searching...</span>
					</>
				) : (
					<>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							/>
						</svg>
						<span>Find</span>
					</>
				)}
			</button>
		</div>
	);
};
