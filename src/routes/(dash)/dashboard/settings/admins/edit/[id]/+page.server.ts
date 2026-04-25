import { db, dbf, adminsTable, __db_delete, __db_slug } from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { _formData, validEmail, hashPWD } from '$lib/dashboard/api';

export const load = (async ({ params, locals }) => {
    const {id} = params 
    let item = await db.query.adminsTable.findFirst({
        where: dbf.eq(adminsTable.id, +id)
    })
    if(!item) throw error(404, 'Admin not found')

    const _canManage_ = locals.admin?.role === 'super-admin' || locals.admin?.id === +id

    if(!_canManage_) throw redirect(301, '/dashboard/settings/admins?msg=Invalid credentionals')

    return { item, _canManage_ };
}) satisfies PageServerLoad;

export const actions: Actions = {
    edit: async ({ params, request }) => {
        const { id } = params 
        let { name, email } = _formData(await request.formData())

        name = name?.trim()
        email = email?.trim()?.toLowerCase()

        if(!name || name.length < 3) return fail(500, {msg: 'Name required'})
        if(!email || !validEmail(email)) return fail(500, {msg: 'Valid email required'})

        const check = await db.query.adminsTable.findFirst({
            where: dbf.and(
                dbf.not(dbf.eq(adminsTable.id, +id)),
                dbf.eq(adminsTable.email, email)
            )
        })

        if(check) return fail(500, {msg: 'Email already used by another admin'})

        try {
            await db.update(adminsTable).set({
                name,
                email
            }).where(dbf.eq(adminsTable.id, +id))
    
            return {
                msg: 'Saved'
            }
        } catch (error) {
            console.log(error);
            return fail(500, { msg: error?.sqlMessage })
        }
    }, 
    
    changepwd: async ({ params, request }) => {
        const {id} = params 
        const {password, password_verify} = _formData(await request.formData())

        if(!password || password.length < 8) return fail(500, {msg: 'Password required, min 8 characters'})
        // if(checkPassword(password).score < 4 ) return fail(500, {msg: 'Use strong password, weak passwords are not allowed'})
        if(password !== password_verify) return fail(500, {msg: 'Password must match'})

        try {
            await db.update(adminsTable).set({
                password: hashPWD(password),
                token: crypto.randomUUID()
            }).where(dbf.eq(adminsTable.id, +id))
    
            return {
                msg: 'Password Changed'
            }
        } catch (error) {
            console.log(error);
            return fail(500, { msg: error?.sqlMessage })
        }
    }, 

    delete: async ({ params }) => {
        const {id} = params
        await __db_delete(adminsTable, id)
        return redirect(301, '/dashboard/settings/admins')
    }
}
