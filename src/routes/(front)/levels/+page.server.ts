import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

/** Old URL — keep working for shared links */
export const load: PageServerLoad = () => {
	redirect(301, '/withdrawal-limits')
}
