import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const testCoockie = async () => {
	const cookieStore = await cookies();
	const testCookie = cookieStore.get('test-cookie');
	const counter = testCookie?.value ? parseInt(testCookie.value) + 1 : 1;

	// Создаём ответ
	const response = NextResponse.json({
		message: `This is visit number ${counter}`,
	});

	// Устанавливаем куки НА ответ
	response.cookies.set({
		name: 'test-cookie',
		value: counter.toString(),
	});

	return response;
};
