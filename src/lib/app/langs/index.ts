import { langs } from './locales'
import { e2a, getByPath, type Path, type SupportedLangs } from '$lib/app'

export const generateLocale = <T extends object>(locale: T) => {
    return (input: Path<T>, lang: SupportedLangs = 'en') => {
        if (!input) return ''
        try {
            const term = input+`.${lang || 'en'}`
            const res = getByPath(locale, term) || getByPath(locale, input as string)
            // return lang === 'ar' ? e2a(res) : res
            return res
        } catch (error) {
            console.log(`LANGS: invalid for (${input})`)
            return ''
        }
    }
}

export const trans = generateLocale(langs)
