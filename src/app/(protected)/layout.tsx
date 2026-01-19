import { SidebarProvider } from '@/providers/SidebarProvider';
import { Header } from '@/shared/components/header';
import { Sidebar } from '@/shared/components/sidebar';
import SidebarLogout from '@/shared/components/sidebar/SidebarLogout';
import SidebarOverlay from '@/shared/components/sidebar/SidebarOverlay';
import { ReactNode } from 'react';

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
	return (
		<SidebarProvider>
			{/* Header — sticky сверху */}
			<Header>
				<Header.Logo />
				<Header.Tabs />
				<Header.Actions />
			</Header>

			{/* Overlay для мобилки */}
			<SidebarOverlay />
			<Sidebar.MobileToggle />

			{/* Контейнер для sticky sidebar */}
			<div className='mt-14.25 flex'>
				{/* Sidebar — sticky слева */}
				<Sidebar>
					<Sidebar.Nav>
						<Sidebar.NavItem entity='dashboard' icon='window' label='Dashboard' />
						<Sidebar.NavItem entity='orders' icon='file' label='cPanel' />
						<Sidebar.NavItem entity='users' icon='file' label='Users' />
						<Sidebar.NavItem entity='account' icon='file' label='Orders' />
					</Sidebar.Nav>
					<Sidebar.Footer>
						<SidebarLogout />
					</Sidebar.Footer>
				</Sidebar>

				{/* Main — растягивается на оставшееся пространство */}
				<main className='flex-1'>{children}</main>
			</div>
		</SidebarProvider>
	);
};

export default ProtectedLayout;
