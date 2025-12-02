/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return [
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
    // Exclude problematic routes from static generation
    generateBuildId: async () => {
        return 'build-' + Date.now().toString();
    },
};

export default nextConfig;
