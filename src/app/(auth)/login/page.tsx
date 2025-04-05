'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useLogin } from '../hooks/useLogin';

interface ILoginFormInputs {
	email: string;
	password: string;
}

export default function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginFormInputs>();
	const { login, isLoading, error } = useLogin();

	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	login(email, password);
	// };
	const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
		console.log('Form data:', data);
		await login(data.email, data.password);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-ctp-base py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-ctp-mauve'>
						Вход в аккаунт
					</h2>
					<p className='mt-2 text-center text-sm text-ctp-subtext0'>
						Введите данные для входа в систему
					</p>
				</div>

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

					<div className='flex items-center justify-between'>
						<div className='text-sm'>
							<a href='#' className='font-medium text-ctp-blue hover:text-ctp-sapphire'>
								Забыли пароль?
							</a>
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

				<div className='text-center'>
					<p className='text-sm text-ctp-subtext0'>
						Нет аккаунта?{' '}
						<a href='/register' className='font-medium text-ctp-blue hover:text-ctp-sapphire'>
							Зарегистрироваться
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
