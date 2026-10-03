import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

/** True when a real DATABASE_URL is configured. */
export const dbConfigured = Boolean(env.DATABASE_URL?.trim());

if (!dbConfigured) {
	console.warn(
		'[db] DATABASE_URL is not set — marketing pages will load, but auth/dashboard/API DB calls are disabled.'
	);
}

// Pool is only created when configured so missing env does not crash SSR.
const client = dbConfigured ? mysql.createPool(env.DATABASE_URL!) : null;

export const db = client
	? drizzle(client, { schema, mode: 'default' })
	: (new Proxy(
			{},
			{
				get() {
					throw new Error(
						'DATABASE_URL is not set. Add it to .env to use database features.'
					);
				}
			}
		) as ReturnType<typeof drizzle>);

export * from './schema';
export * from './utils';
