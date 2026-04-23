import { country_currency, numeral, toQueryURL, type Country, type SupportedLangs } from "$lib/app";
import { DateTime } from 'luxon'
export { DateTime }

export const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (error) {
        return false
    }
}

export const countryCurrencySymbol = (country: string, lang: 'en' | 'ar' = 'en') => {
    country = country.trim().toLowerCase()
    const currency = country_currency(country as Country)
    return currencySymbol(currency, lang)
}

export const currencySymbol = (currency: string, lang: string = 'en') => {
    if (!currency) return '$'
    currency = currency.trim().toLowerCase()

    const toUSD = ['lbp', 'iqd', 'syp', 'usd']
    if (toUSD.includes(currency)) return '$'

    return (0).toLocaleString(lang, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).replace(/\d/g, '').trim()
}

export const __number = (amount, lang) => {
    if (lang === 'ar') return e2a(amount)
    return amount
}

export const __price = ({
    amount,
    country,
    lang = 'en',
    from = false
}: {
    amount: string | number,
    country: string,
    lang?: 'en' | 'ar',
    from?: boolean,
}) => {
    const locale = {
        from: {
            en: 'From',
            ar: 'من'
        }
    }

    const currency = countryCurrencySymbol(country, lang)
    let _amount = numeral(amount).format('0,0')
    if (lang === 'ar') _amount = e2a(_amount)
    const _from = from ? `${locale['from'][lang]} ` : ''
    if (currency === '$') return `${currency}${_amount}`
    const text = lang === 'ar' ? `${_amount} ${currency}` : `${currency} ${_amount}`
    return `${_from}${text}`
}

export const __currency_price = ({
    amount,
    currency,
    lang = 'en',
}: {
    amount: string | number,
    currency: string,
    lang?: 'en' | 'ar',
}) => {
    const symbol = currencySymbol(currency, lang)
    let _amount = numeral(amount).format('0,0')
    if (lang === 'ar') _amount = e2a(_amount)
    if (currency === '$') return `${symbol}${_amount}`
    return lang === 'ar' ? `${_amount} ${symbol}` : `${symbol} ${_amount}`
}

export const englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
export const arabicNumbers = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"]
export const a2e = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
export const e2a = value => {
    if (!value) return;
    value = value.toString();
    for (var i = 0; i < arabicNumbers.length; i++) {
        value = value.replace(new RegExp(englishNumbers[i], "g"), arabicNumbers[i]);
    }
    return value;
}

export const detectDateTime = (d): DateTime | null => {
    if (!d) return null

    if (DateTime.fromSQL(d).isValid) return DateTime.fromSQL(d)
    if (DateTime.fromISO(d).isValid) return DateTime.fromISO(d)
    if (DateTime.fromJSDate(d).isValid) return DateTime.fromJSDate(d)
    if (DateTime.fromMillis(d).isValid) return DateTime.fromMillis(d)
    if (DateTime.fromObject(d).isValid) return DateTime.fromObject(d)
    return null
}

export const __date_item = (d, lang: SupportedLangs = 'en', format: string = 'MMM dd, yyyy - HH:mm') => {
    // https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    const _date = detectDateTime(d)
    if (d && _date) {
        const res = _date.setLocale(lang).toFormat(format)
        return lang === 'ar' ? e2a(res) : res
    }
    return '---'
}

export const storage = {
    set: (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v)),
    get: (k: string, d: any = ""): any => JSON.parse(localStorage.getItem(k) as string) || d,
    remove: (k: string) => localStorage.removeItem(k)
}

export const __ip = (request, getClientAddress) => request.headers.get('true-client-ip') || request.headers.get('x-forwarded-for') || getClientAddress() || '127.0.0.1'

export const getVercelHeaders = (headers: Headers) => {
    const ip = headers.get('x-real-ip') || headers.get('true-client-ip') || headers.get('x-forwarded-for') || '127.0.0.1'
    const continent = headers.get('x-vercel-ip-continent')
    const country = headers.get('x-vercel-ip-country')
    const region = headers.get('x-vercel-ip-country-region')
    const city = headers.get('x-vercel-ip-city')
    const latitude = headers.get('x-vercel-ip-latitude')
    const longitude = headers.get('x-vercel-ip-longitude')
    const timezone = headers.get('x-vercel-ip-timezone')
    const postalCode = headers.get('x-vercel-ip-postal-code')
    const signature = headers.get('x-vercel-signature')

    return {
        ip,
        continent,
        country,
        region,
        city,
        latitude,
        longitude,
        timezone,
        postalCode,
        signature,
    }
}

export const add_query_args = (uri, params, nocache = false) => {
    params = params || {};
    if (nocache) params._ = Date.now();
    const base = (uri.split('?'))[0]
    const str = (uri.split('?'))[1] || ''
    let query = new URLSearchParams(str)

    for (var key in params) {
        query.set(key, params[key])
    }

    return `${base}?${query.toString()}`
}

export const proxy = (url: string) => {
    if (typeof url !== 'string') return url
    if (url.toLocaleLowerCase().startsWith('data:')) return url
    return `https://iproxy.vercel.app/${url.replace(/^\/+/g, '')}`
}

export const cacheImg = url => `https://wsrv.nl?url=${encodeURIComponent(url)}`

export const qrcodeGen = (text: string, {
    color = '#000000',
    bg = '#ffffff',
    size = 1024,
    cache = false,
}: {
    color?: string;
    bg?: 'transparent' | string;
    size?: number;
    cache?: boolean;
} = {}) => {
    // https://genqrcode.com/

    if (bg === 'transparent') bg = '#FFFFFF00'

    const url = toQueryURL('https://genqrcode.com/embedded', {
        text,
        style: 3,
        inner_eye_style: 1,
        outer_eye_style: 5,
        bordersize: 0,
        width: size,
        height: size,
        color,
        inner_eye_color: color,
        outer_eye_color: color,
        background_color: bg,
    })

    return cache ? cacheImg(url) : url
}

export function removeKeysRecursively(obj, keysToRemove: string[]) {
    if (Array.isArray(obj)) {
        return obj.map(item => removeKeysRecursively(item, keysToRemove));
    }

    if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj).reduce((newObj, key) => {
            if (!keysToRemove.includes(key)) {
                newObj[key] = removeKeysRecursively(obj[key], keysToRemove);
            }
            return newObj;
        }, {});
    }

    return obj;
}
