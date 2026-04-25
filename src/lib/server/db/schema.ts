import { relations } from 'drizzle-orm';
import { mysqlTable, serial, int, varchar, json, tinyint, datetime, index, longtext, boolean, bigint, decimal } from 'drizzle-orm/mysql-core';

const createdAt = datetime().notNull().$defaultFn(() => new Date())
const updatedAt = datetime().$onUpdateFn(() => new Date())

const __dates = {
    createdAt,
    updatedAt,
}

export const adminsTable = mysqlTable("admins", {
	id: serial().primaryKey(),
	name: varchar({length: 191}),
	token: varchar({length: 191}),
	token_sms: int(),
	email: varchar({length: 191}).notNull().unique(),
	password: varchar({length: 191}),
	secret: varchar({length: 191}),
	image: varchar({length: 191}),
	role: varchar({length: 191}),
	info: json(),
	isDev: tinyint().default(0).notNull(),
	loginIp: varchar({length: 191}),
	loginAt: datetime(),
	...__dates
}, (table) => [
	index('tokenIdx').on(table.token),
	index('emailIdx').on(table.email),
])

export const jobsTable = mysqlTable("jobs", {
	id: serial().primaryKey(),
	payload: json(),
	attempts: int().default(0),
	...__dates,
});

export const optionsTable = mysqlTable("options", {
	key: varchar({length: 191}).notNull().unique(),
	value: longtext(),
	...__dates,
});

export const usersTable = mysqlTable('users', {
	id: serial().primaryKey(),
	name: varchar({length: 191}).notNull(),
	mobile: varchar({length: 191}),
	email: varchar({length: 191}).unique().notNull(),
	password: varchar({length: 191}).notNull(),
	token: varchar({length: 191}).notNull(),
	code: varchar({length: 191}),
	verified: boolean().default(false).notNull(),
	country: varchar({length: 191}),
	image: varchar({length: 191}),
	loginIp: varchar({length: 191}),
	loginAt: datetime(),
	...__dates,
}, (table) => [
	index('nameIdx').on(table.name),
	index('emailIdx').on(table.email),
	index('countryIdx').on(table.country),
]);
export type UsersTableType = typeof usersTable.$inferSelect;

// export const usersRelations = relations(usersTable, ({ one, many }) => ({
// 	referral: one(usersTable, {
// 		fields: [ usersTable.referredBy ],
// 		references: [ usersTable.referralCode],
// 		relationName: 'referral'
// 	}),
// 	tickets: many(ticketsTable, {
// 		relationName: 'userTickets'
// 	}),
// }));

export const passwordResetTable = mysqlTable('password-resets', {
	userId: bigint({ mode: 'number', unsigned: true }).notNull(),
	token: varchar({length: 191}),
	expires: bigint({ mode: 'number', unsigned: true }),
})

export const newsletterTable = mysqlTable('newsletter', {
	id: serial().primaryKey(),
	name: varchar({length: 191}),
	email: varchar({length: 191}).unique(),
	createdAt,
}, (table) => [
	index('emailIdx').on(table.email),
]);

// export const chatsTable = mysqlTable('chats', {
// 	id: serial().primaryKey(),
// 	name: varchar({length: 191}),
// 	email: varchar({length: 191}),
// 	mobile: varchar({length: 191}),
// 	createdAt,
// }, (table) => [
// 	index('emailIdx').on(table.email),
// 	index('mobileIdx').on(table.mobile),
// ])

// export const chatsRelations = relations(chatsTable, ({ many }) => ({
// 	entries: many(chatEntriesTable)
// }))

// export const chatEntriesTable = mysqlTable('chatEntries', {
// 	id: serial().primaryKey(),
// 	chatId: bigint({ mode: 'number', unsigned: true }).references(() => chatsTable.id),
// 	role: varchar({length: 191}),
// 	content: longtext(),
// 	createdAt,
// })

// export const chatEntriesRelations = relations(chatEntriesTable, ({ one }) => ({
// 	chat: one(chatsTable, { fields: [chatEntriesTable.chatId], references: [chatsTable.id] }),
// }));
