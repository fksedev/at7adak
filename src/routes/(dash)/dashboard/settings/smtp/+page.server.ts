import type { Actions, PageServerLoad } from './$types';
import { get_all_options, update_option, toEmail } from "$lib/dashboard/api";

export const load = (async () => {
    const res = await get_all_options()

    // console.log('res', res)

    let opts:any = {
        smtp_email: '',
        smtp_name: '',
        smtp_enc_type: '',
        smtp_host: '',
        smtp_port: '',
        smtp_username: '',
        smtp_password: '',
    }
    Object.keys(res).forEach( i => opts[i] = res[i] )

    return { res, opts };
}) satisfies PageServerLoad;

export const actions: Actions = {
    save: async ({ request }) => {
        const req = Object.fromEntries(await request.formData())
        const ret: any = [];
        
        for( const key in req) {
            const value = req[key].toString()
            await update_option(key, value)
            ret.push({key, value})
        }

        return ret
    },

    send: async ({ request }) => {
        const {email} = Object.fromEntries(await request.formData())
        
        const res = await toEmail({ to: email, subject: 'Testing SMTP', message: 'This is SMTP test' })

        return { res }
    }
}
