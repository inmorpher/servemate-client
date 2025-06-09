'use client';

const LogoutButton = () => {
	return (
		<button className='w-full flex items-center p-3 text-ctp-red hover:bg-ctp-surface0 rounded-md transition-colors'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				className='h-5 w-5 mr-3'
				viewBox='0 0 20 20'
				fill='currentColor'
			>
				<path
					fillRule='evenodd'
					d='M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm3 4a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z'
					clipRule='evenodd'
				/>
			</svg>
			<span>Logout</span>
		</button>
	);
};

export default LogoutButton;
