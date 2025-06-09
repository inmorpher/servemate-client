// import { debounce } from '@/shared/utils/devounce';
// import { useCallback, useRef, useState } from 'react';

// interface SearchBarProps<T> {
// 	criteria: T;
// 	onCriteriaChange: (criteria: T) => void;
// 	onSearch: () => void;
// 	isLoading: boolean;
// 	searchField: keyof T;
// 	placeholder?: string;
// 	minLength?: number;
// }

// function SearchBar<T>({
// 	criteria,
// 	onCriteriaChange,
// 	onSearch,
// 	isLoading,
// 	searchField,
// 	placeholder = 'Search...',
// 	minLength = 3,
// }: SearchBarProps<T>) {
// 	const [searchValue, setSearchValue] = useState(criteria[searchField] || '');

// 	const debouncedSearch = useRef(
// 		debounce((value: string) => {
// 			onCriteriaChange({ ...criteria, [searchField]: value, page: 1 });
// 		}, 300)
// 	);

// 	const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
// 		const value = event.target.value;
// 		setSearchValue(value);

// 		if (value.trim().length < minLength) {
// 			onCriteriaChange({ ...criteria, [searchField]: '', page: 1 });
// 			return;
// 		}

// 		debouncedSearch.current(value);
// 	}, [minLength]);
// }
