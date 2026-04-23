import { persisted, writable, type SupportedLangs } from "$lib/app";

export const _lang = persisted<SupportedLangs>('lang', 'en')

export const _USER = writable<App.Locals['user'] | null>(null)
export const _IP = writable<string>()
export const _COUNTRY = writable<string>()
export const _CITY = writable<string>()
export const _SW_REFFERAL_CODE = writable<string>()

export const _loginModalOpen = writable<boolean>(false)
export const _signupModalOpen = writable<boolean>(false)
export const _tempNumbers = writable<number[]>([])
