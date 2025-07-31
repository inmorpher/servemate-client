'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useSearchNavigation = <T extends Record<string, unknown>>() => {
	const router = useRouter();
	const pathname = usePathname();

	const updateSearchCriteria = useCallback(
		(newCriteria: Partial<T>, currentCriteria: T) => {
			const updatedCriteria = { ...currentCriteria, ...newCriteria };

			// Build query params, excluding undefined/null/empty values
			const searchParams = new URLSearchParams();
			Object.entries(updatedCriteria).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					if (Array.isArray(value)) {
						searchParams.set(key, value.join(','));
					} else {
						searchParams.set(key, String(value));
					}
				}
			});

			router.push(`${pathname}?${searchParams.toString()}`);
		},
		[router, pathname]
	);

	return { updateSearchCriteria };
};
