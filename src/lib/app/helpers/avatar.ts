import { md5 } from "$lib/app";
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

export const gravatar = (email: string, params: GravatarParams = {}) => {
	const size = params.size || 256
	const fallback = params.fallback || 'identicon'
	const emailHash = md5(email.trim().toLowerCase())
	return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=${fallback}`;
}

export const avatarSVG = (text, {
	size = 256,
	rounded = true,
	radius = 0,
	bg = '#000',
	color = '#fff',
	fontFamily = 'Helvetica, Tahoma, Arial, sans-serif'
}: {
    size?: number,
    rounded?: boolean,
    radius?: number,
    bg?: string,
    color?: string,
    fontFamily?: string,
} = {}) => {

    const isRTLString = (s) => {           
        var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
            rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
            rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');
    
        return rtlDirCheck.test(s);
    }

    const initials = (name) => {
        if(!name) return ''
        let initials
        let arr = name.split(' ');
        if(arr.length < 2) {
            arr = name.split('')
            initials = arr[0] + (arr[1] ?? '')
        } else {
            initials = arr.shift()?.charAt(0) + arr.pop()?.charAt(0);
        }
        return initials.toUpperCase();
    }

	const TEXT = initials(text)
	const fontSize = isRTLString(text) ? size! / 2 : size! / 2.5
	let y = isRTLString(text) ? 60 : 64
	if(size! < 128) y = isRTLString(text) ? 66 : 64

	if(rounded) radius = Number(size) / 2

	const getSVG = (text) => (`<?xml version="1.0" encoding="utf-8"?>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
		<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bg}"/>
		<text dx="50%" dy="${y}%" font-size="${fontSize}" text-anchor="middle" fill="${color}" style="font-family: ${fontFamily};">${text}</text>
		</svg>`)
        
    try {
		return svgToDataUri( getSVG(TEXT) )
	} catch (error) {
		return svgToDataUri( getSVG('-_-') )
	}
}
