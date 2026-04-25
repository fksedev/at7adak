import type { PageServerLoad } from './$types';
import { adminsTable, db, dbf } from "$lib/server/db"
import { authenticator } from '$lib/dashboard/api';
import { getUrlQuery, paginateDB, _APP_NAME, qrcodeGen } from '$lib/dashboard';

const mapper = async (items) => {
    const ret: any = []
    const name = `${_APP_NAME} Dashboard`
    for(const x of items) {
        const key = authenticator.keyuri(x.email, name, x.secret)
        const qr = qrcodeGen(key, { size: 800, cache: true })
        x.gakey = key 
        x.qr = qr 
        ret.push(x)
    }
    return ret
}

export const load = (async ({locals, url}) => {
    const { admin } = locals
    let { page, order, search } = getUrlQuery(url)
    page = parseInt(page || '1')
    let perPage = 24
    order = order || 'latest'

    let searchTerm = search ? `%${search.toLowerCase()}%` : ''

    let orderBy

    switch (order) {
        case 'newest': 
            orderBy = dbf.asc(adminsTable.createdAt)
        break;
        case 'name': 
            orderBy = dbf.asc(adminsTable.name)
        break;
        case 'latest': default: 
            orderBy = dbf.desc(adminsTable.createdAt)
        break;
    }
    let where

    if(admin?.role !== 'super-admin'){
        where = dbf.not(dbf.eq(adminsTable.role, 'super-admin'))
    }

    if(search?.length > 2){
        where = dbf.or(
            dbf.ilike(adminsTable.name, searchTerm),
            dbf.ilike(adminsTable.email, searchTerm),
            dbf.ilike(adminsTable.id, searchTerm),
        )
    }

    let [{total}] = await db.select({total: dbf.count()}).from(adminsTable).where(where)

    let items = await db.query.adminsTable.findMany({
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
        url: '/dashboard/settings/admins'
    })

    return {
        items: await mapper(items),
        pagination,
        order,
        search,
    };
    
}) satisfies PageServerLoad;
