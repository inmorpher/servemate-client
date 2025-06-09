import { Metadata } from 'next';
import { UsersPageContainer } from './testList';

export const metadata: Metadata = {
	title: 'Users',
	description: 'User management page',
};

export default async function UsersPage() {
	return <UsersPageContainer />;
}
