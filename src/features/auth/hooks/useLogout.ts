import { useAuth } from '@/providers/AuthProvider';
import { cleanup } from '@/shared/api/instance';
import { useRouter } from 'next/navigation';
import { authActions } from '../api';

interface IUseLogout {
	logout: () => Promise<void>;
	isAuth: boolean;
}

export const useLogout = (): IUseLogout => {
	const { isAuth, setIsAuth } = useAuth();
	const router = useRouter();
	const logout = async () => {
		try {
			await authActions.logout();
			setIsAuth(false);
			cleanup();
			router.push('/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return { logout, isAuth };
};
