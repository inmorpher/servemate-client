import LoginForm from '@/features/auth/login-form/ui/LoginForm';
import { Suspense } from 'react';

export default function Login() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-ctp-base py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-ctp-mauve'>
						Log in to your account
					</h2>
					<p className='mt-2 text-center text-sm text-ctp-subtext0'>
						Enter your email and password to log in.
					</p>
				</div>
				<Suspense fallback={<div>Загрузка...</div>}>
					<LoginForm />
				</Suspense>
			</div>
		</div>
	);
}
