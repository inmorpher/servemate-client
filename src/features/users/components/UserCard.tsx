import { UserListItem } from '@servemate/dto';
import { formatDate, getRoleColor } from '../utils/userHelpers';

function UserCard({ user }: { user: UserListItem }) {
	return (
		<div className='relative bg-ctp-surface0 hover:bg-ctp-surface1 p-4 border border-ctp-surface1 rounded-lg overflow-y-hidden transition-colors hover:cursor-pointer'>
			<div className={`absolute left-0 top-0 h-full w-1 ${getRoleColor(user.role)}`} />
			<div className='flex justify-between items-start'>
				<div className='flex-grow'>
					<div className='flex items-center gap-3 mb-2'>
						<h3 className='font-semibold text-ctp-text text-lg'>{user.name}</h3>
						<span
							className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}
						>
							{user.role}
						</span>
						<span
							className={`px-1 py-1 text-xs font-medium rounded-full ${
								user.isActive
									? 'bg-ctp-green bg-opacity-20 text-ctp-green'
									: 'bg-ctp-red bg-opacity-20 text-ctp-red'
							}`}
						>
							{/* {user.isActive ? 'Активен' : 'Неактивен'} */}
						</span>
					</div>

					<p className='mb-2 text-ctp-subtext0'>{user.email}</p>

					<div className='flex flex-wrap gap-4 text-ctp-subtext1 text-xs'>
						<span>Created: {formatDate(user.createdAt)}</span>
						<span>Updated: {formatDate(user.updatedAt)}</span>
						{user.lastLogin && <span>Last login: {formatDate(user.lastLogin)}</span>}
					</div>
				</div>

				{/* <div className='flex items-center gap-2'>
					<button className='hover:bg-ctp-blue hover:bg-opacity-10 p-2 rounded-md text-ctp-blue transition-colors'>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
							/>
						</svg>
					</button>
					<button className='hover:bg-ctp-red hover:bg-opacity-10 p-2 rounded-md text-ctp-red transition-colors'>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
							/>
						</svg>
					</button>
				</div> */}
			</div>
		</div>
	);
}

export default UserCard;
