import { FC, ReactNode } from 'react';

export interface ISidebarContextType {
	isOpen: boolean;
	pathname: string;
	setIsOpen: (isOpen: boolean) => void;
	toggleSidebar: () => void;
}

export interface ISidebarProps {
	children: ReactNode;
}

export interface ISidebarHeaderProps {
	children?: ReactNode;
	title?: string;
	imgSrc?: string;
}

export interface ISidebarNavProps {
	children: ReactNode;
	title?: string;
}

export interface ISidebarNavItemProps {
	href: string;
	icon?: string;
	label: string;
}

export interface ISidebarFooterProps {
	children: ReactNode;
	className?: string;
}

export interface ISidebarMobileToggleProps {
	children?: ReactNode;
	className?: string;
	onClick?: () => void;
}

export interface ISidebarComponent extends FC<ISidebarProps> {
	Header: FC<ISidebarHeaderProps>;
	Nav: FC<ISidebarNavProps>;
	NavItem: FC<ISidebarNavItemProps>;
	Footer: FC<ISidebarFooterProps>;
	MobileToggle: FC<ISidebarMobileToggleProps>;
	Overlay: FC;
}
