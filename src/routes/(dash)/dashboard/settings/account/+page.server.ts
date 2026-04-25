import type { Actions } from './$types';
import { checkPWD, hashPWD, _formData } from "$lib/dashboard/api";
import { fail } from '@sveltejs/kit';
import { db, dbf, adminsTable } from '$lib/server/db';

export const actions: Actions = {
    process: async ({ request, locals }) => {
        const { oldpassword, password } = _formData(await request.formData())
        const admin = locals.admin

        const user = await db.query.adminsTable.findFirst({
            where: dbf.eq(adminsTable.id, +admin.id)
        })

        if(password.length < 8) {
            return fail(400, { message: 'Password length must be 8 characters minimum.'})
        }
        
        const check = checkPWD(oldpassword, user!.password)
        if(!check) return fail(500, {message: 'wrong old password'})

        await db.update(adminsTable).set({
            password: hashPWD(password)
        }).where(dbf.eq(adminsTable.id, user!.id))

        return { msg: 'updated' }
    }
}
