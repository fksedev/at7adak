import { DateTime } from 'luxon'
export const getVercelHeaders = (headers: Headers) => {
    const ip = headers.get('x-real-ip') || headers.get('true-client-ip') || headers.get('x-forwarded-for')
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

export const englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
export const arabicNumbers = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"]
export const a2e = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
export const e2a = value => {
    if (!value) return;
    value=value.toString();
    for (var i = 0; i < arabicNumbers.length; i++) {
        value = value.replace(new RegExp(englishNumbers[i], "g"), arabicNumbers[i]);
    }
    return value;
}

export const pad = (number: string | number, length = 2) => `000${number}`.slice(length * -1);

export const pre = obj => `<pre class="font-mono text-sm w-full overflow-x-auto">${JSON.stringify(obj, null, 4)}</pre>`

export const keyboardKeys = {
	command: '⌘',
	shift: '⇧',
	enter: '↵',
	alt: '⎇',
	option: '⎇',
	tab: '⇥',
	capslock: '⇪',
	control: '^',
	up: '↑',
	down: '↓',
	left: '←',
	right: '→',
	back: '⌫',
}

export const getUrlQuery: any = url => {
	const result = {}
	if (!url) return result
	const params = new URLSearchParams(new URL(url).search)
	const entries = params.entries()
	for (const [key, value] of entries) {
		if (key.includes('[]')) {
			result[key.replace('[]', '')] = params.getAll(key)
		} else {
			result[key] = value;
		}
	}
	return result;
}

export const add_query_args = (uri, params, nocache = false) => {
    params = params || {};
    if(nocache) params._ = Date.now();
    const base = (uri.split('?'))[0]
    const str = (uri.split('?'))[1] || ''
    let query = new URLSearchParams(str)

    for (var key in params) {
        query.set(key, params[key])
    }

    return `${base}?${query.toString()}`
}

export const detectDateTime = (d): DateTime | null => {
    if(!d) return null
    if(DateTime.fromSQL(d).isValid) return DateTime.fromSQL(d)
    if(DateTime.fromISO(d).isValid) return DateTime.fromISO(d)
    if(DateTime.fromJSDate(d).isValid) return DateTime.fromJSDate(d)
    if(DateTime.fromMillis(d).isValid) return DateTime.fromMillis(d)
    if(DateTime.fromObject(d).isValid) return DateTime.fromObject(d)
    return null
}

export const __date_item = (d, label = '', withTime = true, df = 'MMM dd, yy', tf = 'HH:mm') => {
    let ret = '--'
    
    const _date = detectDateTime(d)

    if(d && _date){
        const dat = _date.toFormat(df)
        const tim = _date.toFormat(tf)
        ret = dat
        if(withTime){
            ret = `${dat} <span class="opacity-75">${tim}</span>`
        }
    }

    if(label){
        label = `<span class="text-xs">${label}: </span>`
    }

    return `
        <div class="text-sm">
            ${label}
            <span>${ret}</span>
        </div>
    `
}

interface IPaginateParams {
    page: number;
    perPage: number;
    data: any;
    url: string;
    total: number;
}

interface IPaginateResult {
    data: unknown[];
    pagination: {
        totalPage: number;
        nextPage: number | null;
        prevPage: number | null;
        firstPage: number;
        lastPage: number;
        from: number;
        to: number;
        perPage: number;
        total: number;
        currentPage: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        url?: string;
    };
}

export function paginateDB({
    data,
    total,
    page,
    perPage,
}: IPaginateParams): IPaginateResult {
    const offset = (page - 1) * perPage;

    const totalPage = Math.ceil(total / perPage);
    const nextPage = page < totalPage ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const firstPage = 1;
    const lastPage = totalPage;

    const from = offset + 1;
    const to = offset + data.length;

    const pagination = {
        totalPage,
        total,
        perPage,
        from,
        to,
        currentPage: page,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPage,
    };

    return {
        pagination,
        data,
    };
}

export const toQueryURL = (baseURL: string, params) => {
	const url = new URL(baseURL)
	if(params) url.search = new URLSearchParams(params).toString()
	return url.toString()
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
