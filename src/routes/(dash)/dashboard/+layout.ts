import { _lang } from '$lib/app';
import type { LayoutLoad } from './$types';

export const load = (async ({ parent, data }) => {
    _lang.set('en')
    await parent()
    return {
        ...data
    };
}) satisfies LayoutLoad;
