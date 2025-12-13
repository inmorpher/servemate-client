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
			<div className='flex pt-14.25'>
				{/* Sidebar — sticky слева */}
				<Sidebar>
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

				{/* Main — растягивается на оставшееся пространство */}
				<main className='min-h-screen flex-1'>
					<div className='p-6'>{children}</div>
				</main>
			</div>
		</SidebarProvider>
	);
};

export default ProtectedLayout;
