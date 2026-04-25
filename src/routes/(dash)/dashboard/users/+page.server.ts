import type { PageServerLoad } from './$types';
import { db, dbf, usersTable } from "$lib/server/db"
import { getUrlQuery, paginateDB } from '$lib/dashboard';

export const load = (async ({ url }) => {

    let { page, order, search, country } = getUrlQuery(url)
    page = parseInt(page || '1')
    let perPage = 24
    order = order || 'latest'

    search = (search || '').toString().toLowerCase().trim()

    let searchTerm = search ? `%${search}%` : ''

    let where
    if(search?.length > 2){
        where = dbf.or(
            dbf.ilike(usersTable.name, searchTerm),
            dbf.ilike(usersTable.email, searchTerm),
            dbf.ilike(usersTable.id, searchTerm),
        )
    }

    if (country && country.length === 2) {
        where = dbf.and(
            dbf.eq(usersTable.country, country.toLowerCase()),
            where
        )
    }

    let orderBy

    switch (order) {
        case 'newest': 
            orderBy = dbf.asc(usersTable.createdAt)
        break;
        case 'name': 
            orderBy = dbf.asc(usersTable.name)
        break;
        case 'latest': default: 
            orderBy = dbf.desc(usersTable.createdAt)
        break;
    }

    let [{total}] = await db.select({total: dbf.count()}).from(usersTable).where(where)

    let items = await db.query.usersTable.findMany({
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
        url: '/dashboard/users'
    })

    return {
        items,
        pagination,
        order,
        search,
        country,
    };
}) satisfies PageServerLoad;
