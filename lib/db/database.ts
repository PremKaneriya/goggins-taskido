// lib/db/index.ts
import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

export async function query<T extends QueryResultRow>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> {
  return pool.query(text, params);
}