import Image from 'next/image';

interface HeaderLogoProps {
	title?: string;
	imgSrc?: string;
	children?: React.ReactNode;
}

const HeaderLogo = ({ title = 'ServeMate', imgSrc = '/globe.svg', children }: HeaderLogoProps) => {
	return (
		<div className='flex items-center pb-4 align-middle'>
			<Image src={`${imgSrc}`} alt={`${title} Logo`} width={30} height={30} />
			<h1 className='text-ctp-mauve ml-2 text-xl font-bold'>{title}</h1>
			{children}
		</div>
	);
};

export default HeaderLogo;
