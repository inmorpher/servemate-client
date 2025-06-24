import { UserClientPage } from '@/features/users/ui/UserClientPage';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Users',
	description: 'User management page',
};

export default function UsersPage() {
	return (
		<div className='relative  bg-ctp-surface0 rounded-2xl h-full'>
			<Suspense fallback={<div className='p-4'>Loading...</div>}>
				<UserClientPage />
			</Suspense>
		</div>
	);
}
