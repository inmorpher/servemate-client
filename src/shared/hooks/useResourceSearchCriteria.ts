import { useSearchCriteria } from '@/shared/hooks/useSearchCriteria';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import type { ZodType } from 'zod';

interface UseResourceSearchCriteriaOptions {
	schema: ZodType<unknown>; // Zod schema for parsing, use unknown to avoid strict type conflicts
	numberFields: string[];
	arrayFields: string[];
	resetPageOnFilters?: boolean;
}

export const useResourceSearchCriteria = <T extends Record<string, unknown>>({
	schema,
	numberFields,
	arrayFields,
	resetPageOnFilters = true,
}: UseResourceSearchCriteriaOptions) => {
	const router = useRouter();
	const pathname = usePathname();

	const searchCriteria = useSearchCriteria({
		schema,
		numberFields,
		arrayFields,
	});

	const updateSearchCriteria = useCallback(
		(newCriteria: Partial<T>) => {
			const updatedCriteria = { ...(searchCriteria as T), ...newCriteria };
			const queryParams = buildQueryParams(updatedCriteria);
			router.push(`${pathname}?${queryParams.toString()}`);
		},
		[searchCriteria, router, pathname]
	);

	const setPage = useCallback(
		(page: number) => updateSearchCriteria({ page } as unknown as Partial<T>),
		[updateSearchCriteria]
	);

	const setPageSize = useCallback(
		(pageSize: number) => updateSearchCriteria({ pageSize, page: 1 } as unknown as Partial<T>),
		[updateSearchCriteria]
	);

	const updateFilters = useCallback(
		(newFilters: Partial<T>) => {
			const criteriaWithReset = resetPageOnFilters ? { ...newFilters, page: 1 } : newFilters;
			updateSearchCriteria(criteriaWithReset);
		},
		[updateSearchCriteria, resetPageOnFilters]
	);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}, [searchCriteria]);

	return {
		searchCriteria,
		setPage,
		setPageSize,
		updateFilters,
		updateSearchCriteria,
	};
};
