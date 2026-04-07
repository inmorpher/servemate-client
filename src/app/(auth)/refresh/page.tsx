'use client';

import { refreshSessionAction } from '@/features/auth/api/refresh-sestion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const returnUrl = searchParams.get('returnUrl') || '/dashboard';
	// On mount, redirect to the original requested page after refresh

	useEffect(() => {
		const refresh = async () => {
			try {
				const result = await refreshSessionAction();

				if (result.success) {
					router.replace(returnUrl);
					return;
				}

				if (result.error || !result.success) {
					router.replace('/login');
				}
			} catch (error) {
				router.replace('/login');
			}
		};

		refresh();
	}, [router, returnUrl]);

	return <div>Обновление сессии...${returnUrl}</div>;
}
