'use client';
import { ISidebarContextType } from '@/shared/components/sidebar/types';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const SidebarContext = createContext<ISidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);

	const pathname = usePathname();

	// Закрываем сайдбар при изменении маршрута
	useEffect(() => {
		if (window.innerWidth < 1024) {
			setIsOpen(false);
		}
	}, [pathname]);

	const toggleSidebar = () => {
		if (window.innerWidth < 1024) {
			setIsOpen((prev) => !prev);
		}
	};

	return (
		<SidebarContext.Provider value={{ isOpen, pathname, setIsOpen, toggleSidebar }}>
			{children}
		</SidebarContext.Provider>
	);
};

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider');
	}
	return context;
};
