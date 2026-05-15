'use client';

import { nanoid } from 'nanoid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useTabs } from '../store/useTabs';

export const useTabsSync = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { addTab, setActiveTab } = useTabs();
	const hasReplacedRef = useRef(false);
	const router = useRouter();

	useEffect(() => {
		if (pathname.toLowerCase() !== '/cpanel') return;

		const entity = searchParams.get('entity') || 'overview';
		let tid = searchParams.get('tabId');
		const tabFilters = Object.fromEntries(
			Array.from(searchParams.entries()).filter(([key]) => key !== 'tabId'),
		);

		if (!tid) {
			tid = nanoid(8);

			if (!hasReplacedRef.current) {
				hasReplacedRef.current = true;
				const newSearchParams = new URLSearchParams(searchParams.toString());
				newSearchParams.set('tabId', tid);
				router.replace(`/cpanel?${newSearchParams.toString()}`);
			}

			return;
		}

		if (tid === searchParams.get('tabId')) {
			hasReplacedRef.current = false;
		}

		addTab({
			entity,
			filters: tabFilters,
			title: entity,
		});

		setActiveTab(tid);
	}, [pathname, searchParams, addTab, setActiveTab, router]);
};

// https://docs.google.com/spreadsheets/d/1e04fVhi2LKvrY4smYAdX-V6eXyCmD5cu_QvKe_TQzsA/edit?hl=ru&gid=0#gid=0
// https://docs.google.com/spreadsheets/d/1e04fVhi2LKvrY4smYAdX-V6eXyCmD5cu_QvKe_TQzsA/edit?hl=ru&gid=1436534956#gid=1436534956
