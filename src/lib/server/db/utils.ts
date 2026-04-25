import * as _dbf from "drizzle-orm";
import { db } from "$lib/server/db"

export const dbf = {
    ..._dbf, 
    ilike: (column: _dbf.AnyColumn, value: string) => {
        return _dbf.sql`lower(${column}) like ${value.toLowerCase()}`
    },
    increment: (column: _dbf.AnyColumn, value: number = 1) => {
        return _dbf.sql`${column} + ${value}`
    },
    decrement: (column: _dbf.AnyColumn, value: number = 1) => {
        return _dbf.sql`${column} - ${value}`
    }
}

export const __db_delete = async (table, id) => {
    if(!id) return false
    let [item] = await db.select().from(table).where(dbf.eq(table.id, +id))
    if(!item) return false
    await db.delete(table).where(dbf.eq(table.id, +id))
    return true
}

export const __db_slug = async (name, table, id = 0) => {
    
    const getAll = async (xslug) => {
        return ( await db
            .select({slug: table.slug})
            .from(table)
            .where(dbf.and(
                dbf.like(table.slug, `${xslug}%`),
                dbf.not(dbf.eq(table.id, id))
            ))
        ).map(x => x.slug)
    }

    let slug = slugify(name)
    let allSlugs = await getAll(slug)
    console.log('allSlugs', allSlugs)
    if(!allSlugs.includes(slug)) return slug
    
    for (let i = 1; i <= 99999; i++) {
        if(!allSlugs.includes(slug+'-'+i)) return slug+'-'+i
    }
}

const slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes
        .replace(/^-+/, "") // trim - from start of text
        .replace(/-+$/, ""); // trim - from end of text

    return str;
}
