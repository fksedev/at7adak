import { decrypt, encrypt } from "$lib/dashboard";
// import bcrypt from "bcryptjs";
// export const hashPWD = password => bcrypt.hashSync(password, 8)
// export const checkPWD = (a, b) => bcrypt.compareSync(a, b)

export const hashPWD = password => encrypt(password)
export const checkPWD = (a, b) => a == decrypt(b)

export const _formData = (obj) => Object.fromEntries(obj)

export const generate_token = ( size = 12, alphabet = '23456789abcdefghjklmnpqrstuvwxyz') => {
    let id = '', i = size
    while (i--) {
        id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
}

export const generate_password = (size = 12) => {
    return generate_token(size, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-{}[];|:./<>?~')
}

export const bearer_token = req => {
    const bearer = req?.headers?.authorization || '';
    const token = bearer.replace('Bearer ', '');
    return token
}

export const escapeInput = (s) => s.replace(/&/g, '').replace(/</g, '').replace(/>/g, '').replace(/"/g, '').replace(/=/g, '').replace(/java/g, '').replace(/script/g, '').replace(/onload/g, '').replace(/`/g, '').replace(/'/g, '').replace(/\//g, '').replace(/\+/g, '');

export const nl2br = (message) => escapeInput(message)?.replace(/\r?\n/g, '<br>')

export const __ip = (request, getClientAddress) => request.headers.get('true-client-ip') || request.headers.get('x-forwarded-for') || getClientAddress() || '127.0.0.1'
