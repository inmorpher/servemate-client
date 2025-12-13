import HeaderActions from './HeaderActions';
import HeaderContainer from './HeaderContainer';
import HeaderLogo from './HeaderLogo';
import HeaderTabs from './HeaderTabs';

export const Header = Object.assign(HeaderContainer, {
	Tabs: HeaderTabs,
	Actions: HeaderActions,
	Logo: HeaderLogo,
});
