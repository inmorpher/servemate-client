import type { components } from '@/shared/api/openapi-types';

export type AuthLoginRequest = components['schemas']['LoginRequest'];
export type AuthLoginResponse = components['schemas']['LoginResponse'];
export type AuthUser = components['schemas']['UserSchema'];

export interface AuthMeResponse {
	user: AuthUser;
}
