import type { LayoutLoad } from './$types';

export const load = (async ({ parent, data }) => {
    await parent()
    return {
        ...data
    };
}) satisfies LayoutLoad;
