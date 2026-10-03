import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

function isUsableDatabaseUrl(raw: string | undefined) {
	const url = raw?.trim()
	if (!url) return false
	// Reject .env.example placeholders like mysql://user:password@host:port/db-name
	if (url.includes('@host') || url.includes(':port/') || url.includes('db-name')) return false
	try {
		const parsed = new URL(url)
		return parsed.protocol === 'mysql:' && Boolean(parsed.hostname) && parsed.hostname !== 'host'
	} catch {
		return false
	}
}

// Pool is only created when configured so missing/invalid env does not crash SSR/build.
let client: ReturnType<typeof mysql.createPool> | null = null
let configured = isUsableDatabaseUrl(env.DATABASE_URL)

if (configured) {
	try {
		client = mysql.createPool(env.DATABASE_URL!.trim())
	} catch (err) {
		console.warn('[db] Failed to create MySQL pool — DB features disabled.', err)
		client = null
		configured = false
	}
}

/** True when a real DATABASE_URL is configured. */
export const dbConfigured = configured

if (!dbConfigured) {
	console.warn(
		'[db] DATABASE_URL is not set — marketing pages will load, but auth/dashboard/API DB calls are disabled.'
	)
}

export const db = client
	? drizzle(client, { schema, mode: 'default' })
	: (new Proxy(
			{},
			{
				get() {
					throw new Error(
						'DATABASE_URL is not set. Add it to .env to use database features.'
					)
				}
			}
		) as ReturnType<typeof drizzle>)

export * from './schema';
export * from './utils';
