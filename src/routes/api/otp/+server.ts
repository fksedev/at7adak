import { fetcher, jsonError, jsonSuccess, validPhone } from '$lib/app';
import type { RequestHandler } from './$types';

function generate6DigitNumber(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export const POST: RequestHandler = async ({ request }) => {
    let { to } = await request.json()
    const url = 'https://api.verifyway.com/api/v1/'

    const bearer = '2573$bPNJYHehWnLI1SQIYw0em4sjgQzEtboYW3NE'

    if(!validPhone(to)) return jsonError(`invalid number: ${to}`)

    const payload = {
        channel: "whatsapp",
        type: "otp",
        recipient: to.toString().trim().replace('+', ''),
        code: generate6DigitNumber().toString(),
    }

    try {
        const res = await fetcher.withBearer(bearer).post(url, payload)
    
        return jsonSuccess({ 
            data: res.data,
            headers: res.headers,
            status: res.status
        });

    } catch (error) {
        return jsonError(error?.message || 'Server Error')
    }

};
