export const jsonError = (error: string) => Response.json({ok: false, error})
export const jsonSuccess = (data = {}) => Response.json({ok: true, ...data})

export const getVercelHeaders = (headers: Headers) => {
    return {
        ip: headers.get('x-real-ip') || headers.get('true-client-ip') || headers.get('x-forwarded-for') || '127.0.0.1',
        continent: headers.get('x-vercel-ip-continent'),
        country: headers.get('x-vercel-ip-country'),
        region: headers.get('x-vercel-ip-country-region'),
        city: headers.get('x-vercel-ip-city'),
        latitude: headers.get('x-vercel-ip-latitude'),
        longitude: headers.get('x-vercel-ip-longitude'),
        timezone: headers.get('x-vercel-ip-timezone'),
        postalCode: headers.get('x-vercel-ip-postal-code'),
        signature: headers.get('x-vercel-signature'),
    }
}
