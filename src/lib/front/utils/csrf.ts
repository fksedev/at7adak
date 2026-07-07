import { encrypt, decrypt } from './crypt'

export const csrfToken = () => {
    return encrypt( Date.now().toString() )
}

export const csrfVerify = (headers: Headers, minutes = 0.5) => {
    if(!headers) return false
    const token = headers.get('_csrf') || null // added by default to fetcher
    if(!token) return false

    // console.log('csrf token', token)

    const from = decrypt(token)
    const now = Date.now()
    const duration = (now - from) / 1000
    // console.log('csrf duration', duration)
    return duration <= 60 * minutes // 60 seconds max gap
}

export const csrfVerifyToken = (token, minutes = 1) => {
    if(!token) return false

    console.log('csrf token', token)

    const from = decrypt(token)
    const now = Date.now()
    const duration = (now - from) / 1000
    return duration <= 60 * minutes // 60 seconds max gap
}
