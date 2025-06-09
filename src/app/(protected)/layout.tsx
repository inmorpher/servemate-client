import { SidebarProvider } from '@/providers/SidebarProvider';

import { Sidebar } from '@/shared/components/sidebar';
import SidebarLogout from '@/shared/components/sidebar/SidebarLogout';
import SidebarOverlay from '@/shared/components/sidebar/SidebarOverlay';

import { ReactNode } from 'react';

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
	// Проверяем аутентификацию с помощью NextAuth

	return (
		<div className='flex h-full'>
			<SidebarProvider>
				<SidebarOverlay />
				<Sidebar.MobileToggle />
				<Sidebar>
					<Sidebar.Header />

					<Sidebar.Nav>
						<Sidebar.NavItem href='/dashboard' icon='window' label='Dashboard' />
						<Sidebar.NavItem href='/account' icon='file' label='Account' />

						<Sidebar.NavItem href='/users' icon='file' label='Users' />
					</Sidebar.Nav>

					<Sidebar.Footer>
						<SidebarLogout />
					</Sidebar.Footer>
				</Sidebar>
			</SidebarProvider>
			<main className='flex-1 overflow-auto p-0 py-0'>{children}</main>
		</div>
	);
};

export default ProtectedLayout;
