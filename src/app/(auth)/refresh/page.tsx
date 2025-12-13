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
		console.log('🔄 RefreshPage mounted, starting session refresh...');
		const refresh = async () => {
			try {
				const result = await refreshSessionAction();
				console.log('🔄 Результат обновления сессии:', result);
				if (result.success) {
					console.log('✅ Сессия успешно обновлена, перенаправление на:', returnUrl);
					router.replace(returnUrl);
					return;
				}

				if (result.error || !result.success) {
					console.error('❌ Ошибка обновления сессии:', result.error);
					router.replace('/login');
				}
			} catch (error) {
				console.error('❌ Неизвестная ошибка при обновлении сессии:', error);
				router.replace('/login');
			}
		};

		refresh();
	}, [router, returnUrl]);

	return <div>Обновление сессии...${returnUrl}</div>;
}
