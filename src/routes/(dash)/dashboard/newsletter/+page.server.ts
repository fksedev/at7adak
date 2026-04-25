import type { PageServerLoad } from './$types';
import { db, dbf, newsletterTable } from "$lib/server/db"
import { getUrlQuery, paginateDB } from '$lib/dashboard';

export const load = (async ({ url }) => {

    let { page, order, search } = getUrlQuery(url)
    page = parseInt(page || '1')
    let perPage = 24
    order = order || 'latest'

    search = (search || '').toString().toLowerCase().trim()

    let searchTerm = search ? `%${search}%` : ''

    let where
    if(search?.length > 2){
        where = dbf.or(
            dbf.ilike(newsletterTable.name, searchTerm),
            dbf.ilike(newsletterTable.email, searchTerm),
            dbf.ilike(newsletterTable.id, searchTerm),
        )
    }

    let orderBy

    switch (order) {
        case 'newest': 
            orderBy = dbf.asc(newsletterTable.createdAt)
        break;
        case 'name': 
            orderBy = dbf.asc(newsletterTable.name)
        break;
        case 'latest': default: 
            orderBy = dbf.desc(newsletterTable.createdAt)
        break;
    }

    let [{total}] = await db.select({total: dbf.count()}).from(newsletterTable).where(where)

    let items = await db.query.newsletterTable.findMany({
        where,
        orderBy,
        limit: perPage,
        offset: (page - 1) * perPage,
    })

    let pagination = paginateDB({
        data: items,
        total,
        page,
        perPage,
        url: '/dashboard/newsletter'
    })

    return {
        items,
        pagination,
        order,
        search,
    };
}) satisfies PageServerLoad;
