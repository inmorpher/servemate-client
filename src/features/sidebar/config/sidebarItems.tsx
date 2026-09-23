import { BarChart3, ShoppingCart, Users, type LucideIcon } from 'lucide-react';
import type { TabEntities } from '@/shared/components/tabs/types/tabs.type';

export interface SidebarNavigationItem {
	id: string;
	label: string;
	entity: TabEntities;
	icon: LucideIcon;
	href: string;
	openInTab: boolean;
	color: string;
}

export const sidebarItems: SidebarNavigationItem[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		entity: 'dashboard',
		icon: BarChart3,
		href: '/dashboard',
		openInTab: false,
		color: 'bg-ctp-blue',
	},
	{
		id: 'orders',
		label: 'Orders',
		entity: 'orders',
		icon: ShoppingCart,
		href: '/cpanel',
		openInTab: true,
		color: 'bg-ctp-mauve',
	},
	{
		id: 'users',
		label: 'Users',
		entity: 'users',
		icon: Users,
		href: '/cpanel',
		openInTab: true,
		color: 'bg-ctp-green',
	},
];