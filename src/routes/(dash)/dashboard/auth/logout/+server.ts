import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
    cookies.set('dashtoken', '', {
        path: '/',
        expires: new Date(0),
    })
    throw redirect(302, '/dashboard/auth/login')
};
