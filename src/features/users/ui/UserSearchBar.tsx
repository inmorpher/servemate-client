import { Search, userSearchOptions } from '@/features/search';

import { UserSearchCriteria } from '@servemate/dto';
import { FormEvent, useState } from 'react';

interface UserSearchBarProps {
	isLoading: boolean;
	criteria: UserSearchCriteria;
	updateCriteria: (newCriteria: UserSearchCriteria) => void;
}

function UserSearchBar({ isLoading, criteria, updateCriteria }: UserSearchBarProps) {
	const [searchValue, setSearchValue] = useState<string>('');

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (searchValue.trim().length <= 3) {
			return updateCriteria({
				...criteria,
				name: undefined, // Clear search if input is too short
			}); // Prevent search if input is too short
		}
		updateCriteria({
			...criteria,
			name: searchValue.trim(),
		});
	};

	const toggleSortOrder = () => {
		updateCriteria({
			...criteria,
			sortOrder: criteria.sortOrder === 'desc' ? 'asc' : 'desc',
		});
	};

	const handleReset = () => {
		setSearchValue('');
		updateCriteria({
			...criteria,
		});
	};

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.currentTarget.value);
	};

	const handleChange = (key: string, value: unknown) => {
		if (value === '') {
			value = undefined; // Convert empty string to undefined
		}

		if (key === 'status') {
			key = 'isActive'; // Map 'status' to 'isActive'
		}

		updateCriteria({
			...criteria,
			[key]: value,
		});
	};

	return (
		<Search onSubmit={handleSubmit}>
			{/* Search input */}
			<Search.Input value={searchValue} isLoading={isLoading} onChange={handleOnChange} />

			{/* Filters */}
			<Search.Wrapper>
				{/* Role filter */}

				<Search.Select
					name='role'
					value={criteria.role}
					onChange={handleChange}
					options={userSearchOptions.roles}
					defaultOption={true}
				/>

				{/* Activity filter */}
				{/* <Search.Select
					name='status'
					value={
						criteria?.isActive === true
							? 'true'
							: criteria?.isActive === false
								? 'false'
								: ''
					}
					onChange={handleTestChange}
					options={userSearchOptions.statuses}
					defaultOption={true}
				/> */}

				{/* Sort field */}
				<Search.Select
					name='sortBy'
					value={criteria.sortBy}
					onChange={handleChange}
					options={userSearchOptions.sortOptions}
				/>
				{/* Sort order */}
				<Search.Button sortOptions={criteria.sortOrder} onClick={toggleSortOrder} />

				{/* Reset */}

				<Search.Reset onReset={handleReset} />
			</Search.Wrapper>
		</Search>
	);
}

export default UserSearchBar;
