import countries from './json/countries.json'

type CountryItem = {
    name: string;
    locale: {
        native: string;
        en: string;
        ar: string;
    };
    emoji: string;
    phone: string;
    currency: string;
    currencyInfo: {
        name: string;
        symbol: string;
        native: string;
    };
    capital: string;
    continent: string;
}

export type Country = keyof typeof countries

const emptyCountry = {
    name: '',
    locale: {
        native: '',
        en: '',
        ar: '',
    },
    emoji: '',
    phone: '',
    currency: '',
    currencyInfo: {
        name: '',
        symbol: '',
        native: '',
    },
    capital: '',
    continent: '',
}

const _norm = x => x.trim().toLowerCase()
export { countries }
export const mena_countries = [
    "dz", "bh", "eg", "iq", "jo", "kw", "lb", "ly", "ma", "om", "qa", "sa", "sy", "tn", "ae", "ye", "ps", "sd"
]
export const gcc_countries = [
    'ae', 'sa', 'qa', 'om', 'kw', 'bh'
]

export const country_currency = (cn: Country | undefined): string => countries[_norm(cn)]?.currency || 'USD'
export const flag_emoji = (cn: Country | undefined): string => countries[_norm(cn)]?.emoji || ''
export const getCountry = (cn: Country | undefined): CountryItem => countries[_norm(cn)] || emptyCountry
export const getCountryLocale = (cn: Country | undefined, lang: 'en' | 'ar' | 'native'): string => getCountry(cn)?.locale[lang] || ''
