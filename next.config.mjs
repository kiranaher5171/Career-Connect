/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/auth/login',
            },
            {
                source: '/signup',
                destination: '/auth/signup',
            },
            {
                source: '/forgot-password',
                destination: '/auth/forgot-password',
            },
            {
                source: '/reset-password',
                destination: '/auth/reset-password',
            },
            {
                source: '/password-updated',
                destination: '/auth/password-updated',
            },
        ];
    },
};

export default nextConfig;
