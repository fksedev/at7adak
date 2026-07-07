import type { Actions, PageServerLoad } from './$types';
import { authenticator, checkPWD, __ip, generate_password, hashPWD, _formData, toEmail } from "$lib/dashboard/api"
import { fail, redirect } from '@sveltejs/kit';
import { db, dbf, adminsTable } from "$lib/server/db"

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    login: async ({ request, cookies, locals }) => {
        const { email, password, token } = _formData(await request.formData())
        
        if(!(email && password)) return fail( 404, {message: 'Data not supplied'})
    
        const item = await db.query.adminsTable.findFirst({
            where: dbf.eq(adminsTable.email, email.toString())
        })

        if(!item) return fail(404, {message: 'User not found'});

        const check = checkPWD(password, item.password)
        if(!check) return fail(500, {message: 'wrong password'})

        if(!item.isDev){
            if(!token) return fail( 404, {message: 'Token not supplied'})
            if(!authenticator.check(token.toString(), item.secret!)) return fail(500, {message: 'Authenticator code wrong'})
        }
    
        await db.update(adminsTable).set({
            loginAt: new Date(),
            loginIp: locals.ip,
        }).where(dbf.eq(adminsTable.id, item.id))

        cookies.set('dashtoken', item.token!, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
        })

        throw redirect(301, '/dashboard')
    }, 
    reset: async ({ request }) => {
        const { email } = Object.fromEntries(await request.formData())
        
        if(!(email)) return fail( 404, {message: 'Data not supplied'})
    
        const item = await db.query.adminsTable.findFirst({
            where: dbf.eq(adminsTable.email, email.toString())
        })

        if(!item) return fail(404, {message: 'User not found'});

        const newPassword = generate_password()
        const password = hashPWD(newPassword)
    
        await db.update(adminsTable).set({
            password
        }).where(dbf.eq(adminsTable.id, item.id))

        await toEmail({
            to: email,
            subject: "Password Reset",
            message: `
                <h2>Password Reset</h2>  
                <p>Hello, we reset your password</p>  
                <p>Here's the new password</p>
                <p>--------</p>
                <h3>${newPassword}</h3>
                <p>--------</p>
            `
        })

        return {
            message: "We reset your password and sent to the email supplied!"
        }
    }
}
