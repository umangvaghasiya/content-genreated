import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'

const dbUrl = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

if (!dbUrl) {
    console.warn("NEXT_PUBLIC_DRIZZLE_DB_URL is not defined. Database features will be disabled.");
}

const sql = dbUrl ? neon(dbUrl) : null;
export const db = sql ? drizzle(sql, { schema }) : (null as any);
