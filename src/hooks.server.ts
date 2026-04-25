import { redirect, type Handle } from "@sveltejs/kit";
import { db, dbf, adminsTable, usersTable } from "$lib/server/db";
import { getVercelHeaders } from '$lib/app'
import { deleteCookie } from "$lib/server/auth";

const fallbackCountry = 'LB'

export const handle: Handle = async ({ event, resolve }) => {
    const { cookies, url, locals, request } = event

    let VERCEL = getVercelHeaders(request.headers)
    VERCEL.country = (VERCEL?.country || fallbackCountry).toLowerCase()
    VERCEL.city = (VERCEL?.city || '')
    VERCEL.ip = (VERCEL?.ip || '127.0.0.1')
    
    locals.country = VERCEL.country
    locals.city = VERCEL.city
    locals.ip = VERCEL.ip
    locals.VERCEL = VERCEL

    // FRONT END
    const token = cookies.get('session')
    
    if(token) {
        const user = await db.query.usersTable.findFirst({ 
            columns: {
                password: false,
                token: false,
            },
            where: dbf.eq(usersTable.token, token),
            with: { referral: {
                columns: {
                    password: false,
                    token: false,
                }
            } },
        })
        if(user) {
            locals.user = {
                ...user,
            }
        } else {
            deleteCookie({ cookies, name: 'session' })
        }
    }

    // BACKEND
    let admin
    const adminToken = cookies.get('dashtoken')
    if(adminToken) {
        admin = await db.query.adminsTable.findFirst({
            columns: {
                password: false,
                token: false,
            },
            where: dbf.eq(adminsTable.token, adminToken)
        })
        if(admin) {
            locals.admin = admin
        } else {
            deleteCookie({ cookies, name: 'dashtoken' })
        }

    }
    
    if(!admin) {
        if(url.pathname.startsWith('/dashboard') && !url.pathname.startsWith('/dashboard/auth')){
            throw redirect(303, '/dashboard/auth/login?revalidateAuth')
        }
    }

    // if(!token) {
    //     if(url.pathname.startsWith('/account')) {
    //         throw redirect(303, '/')
    //     }
    // }

    // if(event.url.pathname.startsWith('/draw')){
    //     return await resolve(event, {
    //         transformPageChunk: ({ html }) => {
    //             return html.replaceAll('class="dark"', "")
    //         }
    //     });
    // }

    return await resolve(event)
}
