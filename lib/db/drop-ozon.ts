const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await pool.query('DROP TABLE IF EXISTS ozon_reports CASCADE');
  console.log('Table dropped successfully');
  await pool.end();
  process.exit(0);
}

main();
