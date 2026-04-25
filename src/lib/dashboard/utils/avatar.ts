import { md5 } from "$lib/dashboard";
import { svgToDataUri } from './svg-data-uri'

interface GravatarParams {
	size?: number;
	fallback?: 'mp' | 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' | 'blank'
}

export const emojiSVG = (emoji, size = 16) => {
	size = Math.min(parseInt(size.toString()), 128)
	return `
		<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16"><text x="0" y="14">${emoji}</text></svg>
	`
}

export const getAvatar = (email: string, size: number = 256) => {
	if(!email) return ''
	const emailRegex = /\S+@\S+\.\S+/
	if(!emailRegex.test(email.toLowerCase())) return ''
	const domain = (email.split('@'))[1]

	const imgClearbit = `https://logo.clearbit.com/${domain}?size=${size}`

	return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}&d=${imgClearbit}`
}

export const gravatar = (email: string, params: GravatarParams = {}) => {
	const size = params.size || 256
	const fallback = params.fallback || 'identicon'
	const emailHash = md5(email.trim().toLowerCase())
	return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=${fallback}`;
}

export const avatar = (text, size = 256, rounded:any = false) => {

	let bgColor = getBackgroundColor(text),
		color = invertColor(bgColor, 1);

	const TEXT = initials(text)

	bgColor = bgColor.replace('#', '')
	color = color.replace('#', '')
	rounded = rounded ? 'true' : 'false'

	// return `https://ui-avatars.com/api/?uppercase=true&name=${TEXT}&background=${bgColor}&color=${color}&size=${size}&rounded=${rounded}&format=png`
	return `https://avatar.bitwize.ae/api/?uppercase=true&name=${TEXT}&background=${bgColor}&color=${color}&size=${size}&rounded=${rounded}`
}

export const avatarSVG = (text, size = 256, rounded = false, radius = 0) => {
	if(typeof text !== 'string') return;
	// if(!/^([a-zA-Z0-9 _-]+)$/.test(text)) return
	// if(text.length < 2) return
	let bgColor = getBackgroundColor(text),
		color = invertColor(bgColor, 1);

	const TEXT = initials(text)
	const fontSize = isRTLString(text) ? size / 2 : size / 2.5
	let y = isRTLString(text) ? 60 : 64
	if(size < 128) y = isRTLString(text) ? 66 : 64

	if(rounded) radius = Number(size) / 2

	let svg = `<?xml version="1.0" encoding="utf-8"?>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
		<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bgColor}"/>
		<text dx="50%" dy="${y}%" font-size="${fontSize}" text-anchor="middle" fill="${color}" font-family="Helvetica, Tahoma, Arial, sans-serif">${TEXT}</text>
		</svg>`

	try {
		return svgToDataUri(svg)
	} catch (error) {
		return svgToDataUri(`<?xml version="1.0" encoding="utf-8"?>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
		<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bgColor}"/>
		<text dx="50%" dy="${y}%" font-size="${fontSize}" text-anchor="middle" fill="${color}">__</text>
		</svg>`)
	}

	

	// return svgString
	// var base64 = Buffer.from(svg).toString('base64');
	// return `data:image/svg+xml;base64,${base64}`;
}

const getColor = () => {
	let hex = "#" + Math.floor(Math.random() * 16777215).toString(16);
	let hexTest;
	// validate if is a color
	if (hex.indexOf("#") === 0) hexTest = hex.slice(1);
	if (hexTest.length !== 6 && hexTest.length !== 3) return getColor();

	return hex;
};

const getBackgroundColor = (stringInput) => {
    const h = [...stringInput].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const s = 95, l = 35 / 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   
		// convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

const initials = (name) => {
	if(!name) return ''
	let initials
	let arr = name.split(' ');
	if(arr.length < 2) {
		arr = name.split('')
		// initials = arr[0] + (arr[1] ?? '')
		initials = arr[0]
	} else {
		initials = arr.shift()?.charAt(0) + arr.pop()?.charAt(0);
	}
	return initials.toUpperCase();
}

const invertColor = (hex, bw) => {
	if (hex.indexOf("#") === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error("Invalid HEX color.");
	}
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);

	if (bw) return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";

	// invert color components
	const nr = (255 - r).toString(16);
	const ng = (255 - g).toString(16);
	const nb = (255 - b).toString(16);
	// pad each with zeros and return
	return "#" + padZero(nr) + padZero(ng) + padZero(nb);
};

const padZero = (str, len = 2) => {
	var zeros = new Array(len).join("0");
	return (zeros + str).slice(-len);
};

const isRTLString = (s) => {           
    var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

    return rtlDirCheck.test(s);
}
