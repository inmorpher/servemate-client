import { workspaceQueryKey } from '@/features/workspace/api/client';
import { getWorkspaceBootstrapOnServer } from '@/features/workspace/api/server';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from '@/shared/components/toaster/ToasterProvider';
import { buildApiQueryKey } from '@/shared/utils/buildApiQueryKey';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getSession } from './lib/session';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'ServeMate',
	description: 'Система управления ServeMate',
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let dehydratedState;
	const session = await getSession();

	if (session.isLoggedIn) {
		try {
			const queryClient = new QueryClient();
			const bootstrap = await queryClient.fetchQuery({
				queryKey: workspaceQueryKey,
				queryFn: getWorkspaceBootstrapOnServer,
				retry: false,
			});
			if (bootstrap.activeTab && bootstrap.activeTabData !== undefined) {
				queryClient.setQueryData(
					buildApiQueryKey(bootstrap.activeTab.type, bootstrap.activeTab.state),
					bootstrap.activeTabData,
				);
			}
			dehydratedState = dehydrate(queryClient);
		} catch {
			// Client-side auth handling remains the fallback for protected routes.
		}
	}

	return (
		<html lang='ru'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<QueryProvider dehydratedState={dehydratedState}>
					<Toaster />
					{children}
				</QueryProvider>
			</body>
		</html>
	);
}
