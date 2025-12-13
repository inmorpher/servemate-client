'use client';

import { refreshSessionAction } from '@/features/auth/api/refresh-sestion';
import { useEffect, useState } from 'react';

export function SessionDebug() {
	const [refreshCount, setRefreshCount] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	// Получаем текущее значение счётчика из cookie
	useEffect(() => {
		const getCookieValue = () => {
			const match = document.cookie.match(/servemate_session=([^;]+)/);
			if (match) {
				// Cookie зашифрована, но можем видеть что она изменилась
				console.log('🍪 Cookie найдена:', match[1].substring(0, 20) + '...');
			}
		};
		getCookieValue();
	}, []);

	const handleRefresh = async () => {
		setLoading(true);
		setMessage('');
		try {
			const result = await refreshSessionAction();
			if (result.success) {
				setRefreshCount(result.refreshCount || 0);
				setMessage(`✅ Session обновлена! Счётчик: ${result.refreshCount}`);
			} else {
				setMessage(`❌ Ошибка: ${result.error}`);
			}
		} catch (error) {
			setMessage(`❌ Ошибка: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='border-ctp-mauve bg-ctp-surface0 rounded-lg border-2 p-4'>
			<h3 className='text-ctp-mauve mb-3 font-bold'>🔧 Session Debug</h3>

			<button
				onClick={handleRefresh}
				disabled={loading}
				className='bg-ctp-blue text-ctp-base hover:bg-ctp-mauve rounded px-4 py-2 disabled:opacity-50'
			>
				{loading ? 'Обновляю...' : 'Обновить Session'}
			</button>

			{refreshCount !== null && (
				<div className='bg-ctp-surface1 text-ctp-text mt-3 rounded p-2'>
					<p>
						Refresh Count: <strong>{refreshCount}</strong>
					</p>
				</div>
			)}

			{message && (
				<div className='bg-ctp-surface1 text-ctp-text mt-2 rounded p-2 text-sm'>
					{message}
				</div>
			)}

			<div className='text-ctp-subtext0 mt-3 text-xs'>
				<p>📍 Открой DevTools → Application → Cookies → servemate_session</p>
				<p>🔍 Следи за изменением значения cookie при обновлении</p>
			</div>
		</div>
	);
}
