import { dev } from "$app/environment"

export const BASE_URL = dev ? 'http://localhost:5173' : 'https://squidway.io'

export const FAKE_PLAYERS_NUM = Math.floor((new Date().getTime())/10000000)
