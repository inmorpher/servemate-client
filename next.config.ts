import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	env: {
		API_URL: process.env.API_URL || 'http://localhost:3002/api',
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
		PRODUCTION: process.env.PRODUCTION || 'DEVELOPMENT',
		SESSION_SECRET: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
	},
	async headers() {
		return [
			{
				source: '/:path^',
				headers: [
					{
						key: 'Permission-Policy',
						value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
					},
				],
			},
		];
	},
	reactCompiler: {
		compilationMode: 'all',
	},
};

export default nextConfig;
