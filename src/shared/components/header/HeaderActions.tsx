interface HeaderActionsProps {
	children?: React.ReactNode;
}

const HeaderActions = ({ children }: HeaderActionsProps) => {
	return <div className='ml-auto flex items-center gap-2'>{children}</div>;
};

export default HeaderActions;
