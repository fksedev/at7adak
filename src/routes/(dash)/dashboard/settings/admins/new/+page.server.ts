import { db, dbf, adminsTable, __db_delete, __db_slug } from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { hashPWD, authenticator, _formData, validEmail } from '$lib/dashboard/api';

export const actions: Actions = {
    add: async ({ request }) => {
        let { name, email, password, password_verify } = _formData(await request.formData())

        name = name?.trim()
        email = email?.trim()?.toLowerCase()
        password = password?.trim()

        if(!name || name.length < 3) return fail(500, {msg: 'Name required'})
        if(!email || !validEmail(email)) return fail(500, {msg: 'Valid email required'})
        if(!password || password.length < 8) return fail(500, {msg: 'Password required, min 8 characters'})
        // if(checkPassword(password).score < 4 ) return fail(500, {msg: 'Use strong password, weak passwords are not allowed'})
        if(password !== password_verify) return fail(500, {msg: 'Password must match'})

        try {
            await db.insert(adminsTable).values({
                name,
                email,
                password: hashPWD(password),
                secret: authenticator.generateSecret(),
                token: crypto.randomUUID(),
                role: 'admin',
            })
        } catch (error) {
            console.log(error);
            return fail(500, { msg: error?.sqlMessage })
        }

        return redirect(301, '/dashboard/settings/admins')
    }
}
