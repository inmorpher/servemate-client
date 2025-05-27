


import Sidebar from "./Sidebar";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import SidebarMobileToggle from "./SidebarMobileToggle";
import SidebarNavigation from "./SidebarNav";
import SidebarNavItem from "./SidebarNavItem";
import SidebarOverlay from "./SidebarOverlay";
import { ISidebarComponent } from "./types";

const SidebarWithComponents = Sidebar as ISidebarComponent

SidebarWithComponents.Header = SidebarHeader;
SidebarWithComponents.Footer = SidebarFooter;
SidebarWithComponents.MobileToggle = SidebarMobileToggle;
SidebarWithComponents.Nav = SidebarNavigation;
SidebarWithComponents.NavItem = SidebarNavItem;
SidebarWithComponents.Overlay = SidebarOverlay

export { SidebarWithComponents as Sidebar };
