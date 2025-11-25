'use client';

import { refreshSessionAction } from '@/features/auth/api/refresg-sestion';
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
		<div className='p-4 border-2 border-ctp-mauve bg-ctp-surface0 rounded-lg'>
			<h3 className='text-ctp-mauve font-bold mb-3'>🔧 Session Debug</h3>

			<button
				onClick={handleRefresh}
				disabled={loading}
				className='px-4 py-2 bg-ctp-blue text-ctp-base rounded hover:bg-ctp-mauve disabled:opacity-50'
			>
				{loading ? 'Обновляю...' : 'Обновить Session'}
			</button>

			{refreshCount !== null && (
				<div className='mt-3 p-2 bg-ctp-surface1 rounded text-ctp-text'>
					<p>
						Refresh Count: <strong>{refreshCount}</strong>
					</p>
				</div>
			)}

			{message && (
				<div className='mt-2 p-2 bg-ctp-surface1 rounded text-ctp-text text-sm'>{message}</div>
			)}

			<div className='mt-3 text-xs text-ctp-subtext0'>
				<p>📍 Открой DevTools → Application → Cookies → servemate_session</p>
				<p>🔍 Следи за изменением значения cookie при обновлении</p>
			</div>
		</div>
	);
}
