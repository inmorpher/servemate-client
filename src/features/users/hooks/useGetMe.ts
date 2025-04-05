'use client';

import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/shared/api/instance';
import { UserListItem } from '@servemate/dto';
import { useCallback, useEffect, useState } from 'react';

export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	isActive: boolean;
	lastLogin: string;
	createdAt: string;
	updatedAt: string;
}

export const useGetMe = () => {
	const { isAuth } = useAuth();
	const [user, setUser] = useState<UserListItem | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = useCallback(async () => {
		if (!isAuth) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await api.get('/auth/me');

			setUser(response.data.user);
		} catch (err) {
			console.error('Ошибка при получении данных пользователя:', err);
			setError('Не удалось загрузить данные пользователя');
		} finally {
			setIsLoading(false);
		}
	}, [isAuth]);

	useEffect(() => {
		if (isAuth) {
			fetchUser();
		}
	}, [isAuth, fetchUser]);

	return {
		user,
		isLoading,
		error,
		refetch: fetchUser,
	};
};
