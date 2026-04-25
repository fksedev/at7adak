import type { RequestHandler } from './$types';
import { csrfVerify, jsonError, jsonSuccess, validEmail } from '$lib/app';
import {db, dbf, newsletterTable } from "$lib/server/db"

const doCheck = async (email) => {
    return await db.query.newsletterTable.findFirst({
        where: dbf.eq(newsletterTable.email, email.trim().toLowerCase())
    })
}

export const POST: RequestHandler = async ({ request }) => {
    if(!csrfVerify(request.headers)) return jsonError('prohibited')
        
    const { name, email } = await request.json()

    if(!validEmail(email)) return jsonError('invalid email')

    const check = await doCheck(email)

    if (check) return jsonError('Email already registered')

    await db.insert(newsletterTable).values({
        name,
        email: email.trim().toLowerCase(),
    })

    const user = await doCheck(email)

    return jsonSuccess({ item: user })
};
