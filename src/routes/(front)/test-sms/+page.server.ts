import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    return {
        country: locals.country
    };
}) satisfies PageServerLoad;
