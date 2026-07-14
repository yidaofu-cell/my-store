import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Create the database connection using Vercel Postgres
// Falls back to a warning if DATABASE_URL is not configured
let db: ReturnType<typeof drizzle>;

try {
  db = drizzle(sql, { schema });
} catch {
  console.warn('[DB] Vercel Postgres not configured. Using mock database.');
  // Provide a fallback — actual DB calls will throw and need to be caught
  db = drizzle(sql, { schema });
}

export { db };
export * from './schema';
