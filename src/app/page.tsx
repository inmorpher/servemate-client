'use client';

import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
	const { isLoading } = useAuth();

	console.log('isLoading', isLoading);
	// Показываем загрузку, пока идет проверка авторизации
	return (
		<div className='min-h-screen flex items-center justify-center bg-ctp-base'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold text-ctp-mauve mb-4'>ServeMate</h1>
				<p className='text-ctp-subtext0 text-xl mb-8'>
					Ваш надежный помощник в управлении проектами
				</p>
				<div className='text-ctp-text'>Загрузка...</div>
			</div>
		</div>
	);
}
