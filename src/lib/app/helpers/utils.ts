import { numeral } from "./numeral";

export const jsonError = (error: string) => Response.json({ok: false, error})
export const jsonSuccess = (data = {}) => Response.json({ok: true, ...data})

export const debounce = (fn, delay = 500) => {
    let timeoutId;

    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn?.(...args)
        }, delay);
    };
};

export const formatNum = (number: number, format = '0,0.000a') => numeral(number).format(format)

export const pad = (number: string | number, length = 2) => `000${number}`.slice(length * -1);

export const lastChrs = (str: string, num: number = 3) => {
    if (typeof str !== 'string') return str
    return str.slice(str.length - num)
}

export const isEmptyObject = (obj) => {
    try {
        const cleanedObject = Object.fromEntries(
            Object.entries(obj).filter(([key, value]) => value)
        );
        return Object.keys(cleanedObject).length === 0
    } catch (error) {
        console.log('isEmptyObject:error', error)
        return true
    }
}

export const calculateWithSlippage = ({
    action,
    amount,
    slippage,
}: {
    action: 'buy' | 'sell',
    amount: number,
    slippage: number,
}) => {
    if (action === 'buy') return amount + (amount * slippage) / 100;
    if (action === 'sell') return amount - (amount * slippage) / 100;
};

export const getRand = (min: number, max: number, rounded: boolean = false) => {
    return rounded ? Math.round((Math.random() * (max - min)) + min) : Number((Math.random() * (max - min)) + min)
}

export const toQueryURL = (baseURL: string, params) => {
    const url = new URL(baseURL)
    if (params) url.search = new URLSearchParams(params).toString()
    return url.toString()
}

let transactionLock = false
export const withLock = async (fn: () => Promise<void>): Promise<void> => {
    if (transactionLock) {
        console.warn('Transaction in progress. Waiting for lock to release...');
        return;
    }
    transactionLock = true;
    try {
        await fn();
    } finally {
        transactionLock = false;
    }
};

export const retry = async <T>(
    fn: () => Promise<T> | T,
    { retries, retryIntervalMs }: { retries: number; retryIntervalMs: number },
    n: number = 1
): Promise<T> => {
    console.warn(`Try #${n}`)
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) {
            console.error(`Try #${n}`, error.message)
            // @ts-ignore
            return null
        }
        await sleep(retryIntervalMs);
        return retry(fn, { retries: retries - 1, retryIntervalMs }, n + 1);
    }
};

export const sleep = async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms))
}

export const wait = async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms))
}

export const nowFormatted = () => {
    const options: any = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short'
    };

    const now = new Date();
    return now.toLocaleString('en-US', options);
}

export const capitalize = str => String(str).charAt(0).toUpperCase() + String(str).slice(1);

export function chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
        array.slice(i * size, i * size + size)
    );
}

export const splitIntoChunks = (arr, num = 2) => arr.reduce((res, item, index) => {
    const chunkIndex = Math.floor(index / num)
    if (!res[chunkIndex]) res[chunkIndex] = [] // start a new chunk
    res[chunkIndex].push(item)
    return res
}, [])

// export const arrayUnique = arr => [...new Set(arr)]

export const truncate = (str, len = 30, omission = '...') => {
    if (typeof str !== 'string') return str
    if (str.length > len) return str.slice(0, len) + omission;
    return str;
}

export const truncateMiddle = function (str, strLen, separator = '...') {
    if (typeof str !== 'string') return str
    if (str.length <= strLen) return str;

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    return str.slice(0, frontChars) + separator + str.slice(str.length - backChars);
};

export const maskEmail = (email: string, visibleChars: number = 2) => {
    const [username, domain] = email.split('@');

    if (username.length <= visibleChars) {
        return email;
    }

    const maskedLength = username.length - visibleChars - 1;
    const maskedPart = '*'.repeat(maskedLength);

    const maskedEmail = username.substring(0, visibleChars) +
        maskedPart +
        username.slice(-1) +
        '@' +
        domain;

    return maskedEmail;
}

export const truncateEmail = (email, usernameLen = 4, domainLen = 11) => {
    const parts = email.split('@');
    if (parts.length !== 2) return email; // Not a valid email format

    let username = parts[0];
    const domain = parts[1];
    const separator = '...';

    // Truncate username if needed
    if (username.length > usernameLen) {
        username = username.substring(0, usernameLen) + separator;
    }

    let truncatedDomain = domain;
    if (domain.length > domainLen) {
        truncatedDomain = separator + domain.slice(-domainLen);
    }

    return `${username}@${truncatedDomain}`;
};

export const displayDecimal = (num, decimals = 6) => {
    if (typeof num !== 'string' && typeof num !== 'number') return num
    num = Number(num).toFixed(decimals).replace(/\.?0+$/, "")
    if (!num.startsWith('0.00')) return num
    const parts = num.split('.')
    let x = parts[1]
    let y = x
    let n = 0
    while (1) {
        if (y.startsWith('0')) {
            n++
            y = y.slice(1)
        } else {
            break;
        }
    }

    return `0.0<sub>${n}</sub>${x.slice(n)}`
}

export const urlify = (text: string) => {
    if (!text || typeof text === 'undefined') return text
    if (typeof text !== 'string') return text
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, '<a href="$1" target="_blank" class="font-medium border-b border-green/40 hover:border-green">$1</a>')
}

export const downloadPlainText = (data, name = 'download') => {
    if (!data || typeof data === 'undefined') return

    let content = `data:text/plain;charset=utf-8,${data}`

    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${name}.txt`);
    document.body.appendChild(link);
    link.click();
}

export const downloadJSON = (data, name = 'download') => {
    if (!data || typeof data === 'undefined') return

    let content = `data:text/json;charset=utf-8,${JSON.stringify(data, null, 4)}`

    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${name}.json`);
    document.body.appendChild(link);
    link.click();
}
