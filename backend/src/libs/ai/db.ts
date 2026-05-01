// backend/src/libs/ai/db.ts
import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error("DATABASE_URL is missing from .env.local");
    }

    pool = new Pool({
      connectionString,
      // REQUIRED for Supabase Pooler
      ssl: {
        rejectUnauthorized: false 
      },
      // Keeps the pool lean for serverless environments
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export const db = {
  async query(text: string, params?: any[]) {
    try {
      const activePool = getPool();
      const res = await activePool.query(text, params);
      return res.rows;
    } catch (error: any) {
      console.error('[DB Query Error]', error.message);
      throw error;
    }
  },
}; 