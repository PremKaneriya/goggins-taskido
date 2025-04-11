// lib/db/index.ts
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { User } from './users';

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

export const getFullNameById = async (userId: number | null) => {
  const result = await query<User>(
    'SELECT full_name FROM users WHERE id = $1 AND is_deleted = false',
    [userId]
  );
  
  return result.rows[0].full_name;
}