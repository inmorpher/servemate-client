'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TestInput() {
	const [inputValue, setInputValue] = useState('');
	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);

		// Обновляем URL без перезагрузки сервера
		const params = new URLSearchParams();
		if (value.trim()) {
			params.set('name', value.trim());
		}

		router.replace(`/users?${params.toString()}`);
	};

	return (
		<div className='mb-4'>
			<input
				type='text'
				placeholder='Type to change URL...'
				value={inputValue}
				onChange={handleInputChange}
				className='px-4 py-2 border rounded'
			/>
		</div>
	);
}
