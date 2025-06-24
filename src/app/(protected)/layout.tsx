import { SidebarProvider } from '@/providers/SidebarProvider';

import { Sidebar } from '@/shared/components/sidebar';
import SidebarLogout from '@/shared/components/sidebar/SidebarLogout';
import SidebarOverlay from '@/shared/components/sidebar/SidebarOverlay';

import { ReactNode } from 'react';

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
	// Проверяем аутентификацию с помощью NextAuth

	return (
		<div className='flex h-full relative bg-ctp-base'>
			<SidebarProvider>
				<SidebarOverlay />
				<Sidebar.MobileToggle />
				<Sidebar>
					<Sidebar.Header />

					<Sidebar.Nav>
						<Sidebar.NavItem href='/dashboard' icon='window' label='Dashboard' />
						<Sidebar.NavItem href='/account' icon='file' label='Account' />

						<Sidebar.NavItem href='/users' icon='file' label='Users' />
						<Sidebar.NavItem href='/orders' icon='file' label='Orders' />
					</Sidebar.Nav>

					<Sidebar.Footer>
						<SidebarLogout />
					</Sidebar.Footer>
				</Sidebar>
			</SidebarProvider>
			<div className='flex-1 overflow-auto p-2 py-2  min-h-screen'>{children}</div>
		</div>
	);
};

export default ProtectedLayout;
