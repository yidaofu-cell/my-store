import * as schema from './schema';

let _db: any = null;
let _warned = false;

function createMockDb() {
  const emptyArray: any[] = [];
  const emptyResult = Promise.resolve(emptyArray);

  // Mock chainable query builder that always returns empty
  const mockQuery = new Proxy(() => {}, {
    get() { return mockQuery; },
    apply() { return mockQuery; },
  });

  return {
    select: () => mockQuery,
    insert: () => ({ values: () => emptyResult, returning: () => emptyResult }),
    update: () => ({ set: () => ({ where: () => emptyResult }) }),
    delete: () => ({ where: () => emptyResult }),
  };
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    if (!_warned) {
      console.warn('[DB] DATABASE_URL not set — using mock. Admin pages will show empty data.');
      _warned = true;
    }
    _db = _db || createMockDb();
    return _db;
  }

  // Lazy import only when DATABASE_URL is set
  if (!_db) {
    try {
      const { drizzle } = require('drizzle-orm/vercel-postgres');
      const { sql } = require('@vercel/postgres');
      _db = drizzle(sql, { schema });
    } catch {
      if (!_warned) {
        console.warn('[DB] Failed to initialize — using mock.');
        _warned = true;
      }
      _db = createMockDb();
    }
  }
  return _db;
}

// Compatibility export — all API routes import { db }
export const db = new Proxy({} as any, {
  get(_, prop: string) {
    const realDb = getDb();
    const val = realDb[prop];
    if (typeof val === 'function') {
      return val.bind(realDb);
    }
    return val;
  },
});

export * from './schema';
