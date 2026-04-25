import type { Actions, PageServerLoad } from './$types';
import { update_option, get_all_options } from "$lib/dashboard/api";

export const load = (async () => {
    const res = await get_all_options()
    
    let opts:any = {

        mailazy_from_email: '',
        mailazy_from_name: '',
        mailazy_apikey: '',
        mailazy_apisecret: '',

        sendgrid_from_email: '',
        sendgrid_from_name: '',
        sendgrid_apikey: '',

        slack_hook: '',

        onesignal_apikey: '',
        onesignal_app_id: '',

        msegat_apikey: '',
        msegat_username: '',
        msegat_usersender: '',

        twilio_id: '',
        twilio_token: '',
        twilio_from: ''
    }
    
    Object.keys(res).forEach( i => opts[i] = res[i] || '' )

    return { res, opts };
}) satisfies PageServerLoad;

export const actions: Actions = {
    save: async ({ request }) => {
        const req = Object.fromEntries(await request.formData())
        const ret: any = [];
        
        for( const key in req) {
            const value = req[key].toString()
            update_option(key, value)
            ret.push({key, value})
        }
        return ret
    }
}
