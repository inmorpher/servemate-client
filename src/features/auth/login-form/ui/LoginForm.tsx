'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { login } from '../../api/login';

export interface ILoginFormInputs {
	email: string;
	password: string;
}

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginFormInputs>();

	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Получаем callbackUrl из URL параметров или используем значение по умолчанию
	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

	const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
		try {
			setIsLoading(true);
			setError(null);
			console.log('Form data:', data);
			console.log('Redirecting to:', callbackUrl);

			// Вызываем серверную функцию, передавая данные формы как объект
			await login(data);

			// Если мы дошли до этой точки без ошибок и редиректа,
			// выполним перенаправление вручную (обычно не выполняется из-за redirect() в серверной функции)
			window.location.href = callbackUrl;
		} catch (err) {
			console.error('Login error:', err);
			setError(err instanceof Error ? err.message : 'Произошла ошибка при входе');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{error && (
				<div className='rounded-md bg-ctp-red/20 p-4 mb-4'>
					<div className='text-sm text-ctp-red'>{error}</div>
				</div>
			)}

			<form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
				<div className='rounded-md shadow-sm -space-y-px'>
					<div>
						<label htmlFor='email-address' className='sr-only'>
							Email
						</label>
						{errors.email && (
							<p className='text-xs text-ctp-red mt-1 px-2'>{errors.email.message}</p>
						)}
						<input
							id='email-address'
							{...register('email', {
								required: 'Email required',
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: 'Please enter valid email',
								},
							})}
							name='email'
							type='email'
							autoComplete='email'
							className='appearance-none rounded-t-md relative block w-full px-3 py-2 bg-ctp-surface0 border border-ctp-overlay0 placeholder-ctp-subtext0 text-ctp-text focus:outline-none focus:ring-ctp-lavender focus:border-ctp-lavender focus:z-10 sm:text-sm'
							placeholder='Email'
						/>
					</div>
					<div>
						<label htmlFor='password' className='sr-only'>
							Пароль
						</label>
						<input
							id='password'
							{...register('password', {
								required: 'Password required',
								minLength: {
									value: 6,
									message: 'Password must be at least 6 characters long',
								},
							})}
							type='password'
							autoComplete='current-password'
							className='appearance-none rounded-b-md relative block w-full px-3 py-2 bg-ctp-surface0 border border-ctp-overlay0 placeholder-ctp-subtext0 text-ctp-text focus:outline-none focus:ring-ctp-lavender focus:border-ctp-lavender focus:z-10 sm:text-sm'
							placeholder='Password'
						/>
						{errors.password && (
							<p className='text-xs text-ctp-red mt-1 px-2'>{errors.password.message}</p>
						)}
					</div>
				</div>

				<div>
					<button
						type='submit'
						disabled={isLoading}
						className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-ctp-crust bg-ctp-blue hover:bg-ctp-sapphire focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ctp-lavender disabled:bg-ctp-blue/70'
					>
						{isLoading ? 'Загрузка...' : 'Войти'}
					</button>
				</div>
			</form>
		</>
	);
};

export default LoginForm;
