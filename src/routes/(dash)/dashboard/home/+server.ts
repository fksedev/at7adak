import type { RequestHandler } from './$types';
import { db, dbf, usersTable, newsletterTable } from "$lib/server/db"

export const POST: RequestHandler = async () => {
    
    const [{totalNewsletter}] = await db
        .select({totalNewsletter: dbf.count()})
        .from(newsletterTable);

    const [{totalUsers}] = await db
        .select({totalUsers: dbf.count()})
        .from(usersTable);

    

    return Response.json({ 
        totalUsers, 
        totalNewsletter,
    })
};
