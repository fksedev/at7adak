import { fetcher, jsonError, jsonSuccess, validPhone } from '$lib/front';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    let { to, text } = await request.json()
    const url = 'https://httpsmsc02.montymobile.com/HTTP/api/Client/SendSMS'

    const Username = 'AThKhTPH'
    const Password = 'Dany@1988@lb'

    if(!validPhone(to)) return jsonError(`invalid number: ${to}`)
    if(!text.toString().length) return jsonError(`invalid text supplied`)

    const payload = {
        "source":"At7adak",
        "dataCoding":0,
        "destination":to.toString().trim().replace('+', ''),
        "text":text,
    }

    try {
        const res = await fetcher.withHeaders({
            Username,
            Password,
        }).withLog().post(url, payload)
    
        return jsonSuccess({ 
            data: res.data,
            headers: res.headers,
            status: res.status
        });
    } catch (error) {
        return jsonError(error?.message || 'Server Error')
    }

};
