import { getUsers } from '@/shared/api/users/users.api';
import { UserSearchCriteria } from '@servemate/dto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const params = request.nextUrl.searchParams;

	console.log('params', params);
	const result = await getUsers(params as UserSearchCriteria);

	console.log('result', result);
	if (!result) {
		return new Response('Error fetching users', { status: 500 });
	}

	const data = result;
	return NextResponse.json(data, {
		status: 200,
	});
}
