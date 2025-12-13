interface HeaderProps {
	children?: React.ReactNode;
}

const HeaderContainer = ({ children }: HeaderProps) => {
	return (
		<header className='border-ctp-surface1 bg-ctp-mantle align-center fixed inset-x-0 top-0 left-0 z-20 flex w-full items-center border-b px-4 py-2'>
			{children && children}
		</header>
	);
};

export default HeaderContainer;

export type { HeaderProps };
