import { Md5 } from "./md5"

export const md5 = (str) => Md5.hashStr(str)

const SALT = `h.8QxI)Mh6D!H5,i`

const uniqueIdMap = new Map<string, number>()

export function uniqueId(prefix = "") {
	let id = (uniqueIdMap.get(prefix) ?? 0) + 1
	uniqueIdMap.set(prefix, id)
	return prefix + id
}

export const generateString = (length: number = 6) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    for (let i = 0; i < length; i++) {
      	result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const generateRandomString = (
	length: number,
	alphabet: string = 'abcdefghijklmnopqrstuvwxyz1234567890'
) => {
	const randomUint32Values = new Uint32Array(length);
	crypto.getRandomValues(randomUint32Values);
	const u32Max = 0xffffffff;
	let result = "";
	for (let i = 0; i < randomUint32Values.length; i++) {
		const rand = randomUint32Values[i] / (u32Max + 1);
		result += alphabet[Math.floor(alphabet.length * rand)];
	}
	return result;
};

export const getTimeAfterSeconds = (seconds: number): number => {
	return new Date().getTime() + 1000 * seconds;
};

export const isWithinExpiration = (expiresInMs: number | bigint): boolean => {
	const currentTime = Date.now();
	if (currentTime > expiresInMs) return false;
	return true;
};

export const hash = (str) => {
    var hash = 5381, i = str.length;
    while(i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0;
}

export const nanoid = (size = 21) => {
	let urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
	let id = ''
	let i = size
	while (i--) {
		id += urlAlphabet[(Math.random() * 64) | 0]
	}
	return id
}

export const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    })
}

export const encrypt = (text, salt = SALT): any => {
	const textToChars = text => text.split('').map(c => c.charCodeAt(0));
	const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
	const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);

	return text.split('')
		.map(textToChars)
		.map(applySaltToChar)
		.map(byteHex)
		.join('');
}

export const decrypt = (encoded, salt = SALT): any => {
	const textToChars = text => text.split('').map(c => c.charCodeAt(0));
	const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
	return encoded.match(/.{1,2}/g)
		.map(hex => parseInt(hex, 16))
		.map(applySaltToChar)
		.map(charCode => String.fromCharCode(charCode))
		.join('');
}

export const jsonEncrypt = (json) => {
	if(!json) return json
	const str = encodeURIComponent(JSON.stringify(json, null, 0))
	return encrypt(str)
}

export const jsonDecrypt = (value) => {
	if(!value) return value
	const str = decrypt(value);
	return JSON.parse(decodeURIComponent(str))
}

export const hashPWD = password => encrypt(password.trim())
export const checkPWD = (a, b) => a == decrypt(b)
