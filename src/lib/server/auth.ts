import { checkPWD, generateRandomString, hashPWD, isWithinExpiration, nanoid, referralCodes, validEmail } from "$lib/app"
import {db, dbf, passwordResetTable, usersTable } from "$lib/server/db"
import { type Cookies } from "@sveltejs/kit"

type User = {
    name?: string,
    email: string,
    password?: string,
    referralCode?: string,
    picture?: string,
    googleId?: string,
    isElite?: boolean,
    eliteInfo?: {
        socialHandle?: string,
        socialPlatform?: string,
        followers?: string,
    }
}

const error = err => ({ok: false, error: err})

export const addCookie = ({
    cookies,
    name,
    value,
    minutes = 60 * 24 * 30,
    sameSite = 'strict'
}: {
    cookies: Cookies,
    name: string,
    value: string,
    minutes?: number,
    sameSite?: boolean | "lax" | "strict" | "none" | undefined,
}) => {
    cookies.set(name, value, {
        path: '/',
        httpOnly: true,
        sameSite,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * minutes,
    })
    return { ok: true }
}

export const deleteCookie = (
    { cookies, name }: 
    { cookies: Cookies, name: string }
) => {
    cookies.set(name, '', {
        path: '/',
        expires: new Date(0),
    })

    return { ok: true }
}

export const createToken = () => crypto.randomUUID()

const generateReferralCode = async () => {
    const code = referralCodes.make()
    const check = await db.query.usersTable.findFirst({
        // where: dbf.eq(usersTable.referralCode, code)
    })
    if (check) return await generateReferralCode()
    return code
}

export const authUserById = async (id) => {
    return await db.query.usersTable.findFirst({
        where: dbf.eq(usersTable.id, id)
    })
}

export const authUserByEmail = async (email) => {
    return await db.query.usersTable.findFirst({
        where: dbf.eq(usersTable.email, email.trim().toLowerCase())
    })
}

export const authLogout = ({ cookies }: { cookies: Cookies }) => {
    return deleteCookie({ cookies, name: 'session' })
}

export const authLogin = async ({
    cookies,
    locals,
    data
}: {
    cookies: Cookies,
    locals: App.Locals,
    data: User
}) => {
    if(!validEmail(data.email)) return error('email required')
    if(!data.password || data.password.length < 6) return error('password required')

    const user = await authUserByEmail(data.email)

    if(!user) return error('User not found')

    const check = checkPWD(data.password, user.password)
    if(!check) return error('wrong password')

    addCookie({ cookies, name: 'session', value: user.token! })

    await db.update(usersTable).set({
        loginAt: new Date(),
        loginIp: locals.ip,
    }).where(dbf.eq(usersTable.id, user.id))

    return { ok: true, ...user }
}

export const authRegister = async ({
    cookies,
    locals,
    data
}: {
    cookies: Cookies,
    locals: App.Locals,
    data: User
}) => {

    if(!data.name || data.name.length < 3) return error('name required')
    if(!validEmail(data.email)) return error('email required')
    if(!data.password || data.password.length < 6) return error('password required')

    const check = await authUserByEmail(data.email)
    if(check) return error('user already registered')

    const token = createToken()
    // const referralCode = await generateReferralCode()
    const email = data.email.trim().toLowerCase()

    const isElite = data?.isElite || false

    await db.insert(usersTable).values({
        name: data.name,
        email,
        password: hashPWD(data.password),
        // referralCode,
        // referredBy: data?.referralCode || cookies.get('sw-referral-code') || null,
        token,
        loginAt: new Date(),
        loginIp: locals.ip,
        country: locals.country,
    })

    // await actionAfterSignup(email)

    const user = await authUserByEmail(data.email)

    addCookie({ cookies, name: 'session', value: token })

    return { ok: true, ...user }
}

export const authGoogle = async ({
    cookies,
    locals,
    data
}: {
    cookies: Cookies,
    locals: App.Locals,
    data: User
}) => {
    const check = await authUserByEmail(data.email)

    const token = createToken()

    if(check) {
        await db.update(usersTable).set({
            token,
            loginAt: new Date(),
            loginIp: locals.ip,
            country: locals.country,
        }).where(dbf.eq(usersTable.id, check.id))
    } else {
        const referralCode = await generateReferralCode()
        const email = data.email.trim().toLowerCase()

        const [{ insertId }] = await db.insert(usersTable).values({
            name: data.name!,
            email,
            password: hashPWD( nanoid(12) ),
            // referralCode,
            // referredBy: cookies.get('sw-referral-code') || null,
            token,
            loginAt: new Date(),
            loginIp: locals.ip,
            country: locals.country,
        })

        // await actionAfterSignup(email)
    }

    addCookie({ cookies, name: 'session', value: token, sameSite: 'lax' })

    const user = await authUserByEmail(data.email)

    return { ok: true, ...user }
}


// PASSWORD RESET
const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const authGeneratePasswordResetToken = async (userId) => {
    const storedUserTokens = await db.query.passwordResetTable.findMany({
        where: dbf.eq(passwordResetTable.userId, userId)
    })

    if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			// check if expiration is within 1 hour and reuse the token
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.token;
	}

    const token = generateRandomString(63)
    await db.insert(passwordResetTable).values({
        token,
        userId,
        expires: new Date().getTime() + EXPIRES_IN
    });
    return token;
};

export const authValidatePasswordResetToken = async (token: string) => {
    const storedToken = await db.query.passwordResetTable.findFirst({
        where: dbf.eq(passwordResetTable.token, token)
    })
    if(!storedToken) return error('Invalid Token')
        
    // keep for route validation
    // await db.delete(passwordResetTable).where(dbf.eq(passwordResetTable.token, token))

    const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error("Expired token");
	}
	return storedToken.userId;
};
