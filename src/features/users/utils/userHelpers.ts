import { UserRole } from '@servemate/dto';

const getRoleColor = (role: UserRole) => {
	switch (role) {
		case 'ADMIN':
			return 'bg-ctp-mauve text-ctp-base';
		case 'MANAGER':
			return 'bg-ctp-peach text-ctp-base';
		case 'HOST':
			return 'bg-ctp-mauve text-ctp-base';
		case 'USER':
			return 'bg-ctp-text text-ctp-base ';
		default:
			return 'bg-ctp-surface1 text-ctp-text';
	}
};

const formatDate = (date: Date | string) => {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export { formatDate, getRoleColor };
