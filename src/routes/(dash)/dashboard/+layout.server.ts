import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {

	return {
		ADMIN: locals.admin,
		country: locals.country,
		city: locals.city,
		ip: locals.ip,
	}
}
