import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'uhai.africa',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_DATABASE || 'uhaiafri_test_last',
  user: process.env.DB_USERNAME || 'uhaiafri_pos_api',
  password: process.env.DB_PASSWORD || 'PAunr5anBYL2kHTHxe2E',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT 1 as test');
    connection.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Base query function
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
}

// Type definitions based on Laravel models
export interface Biller {
  id: number;
  name: string;
  company_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  pos_accnt_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Warehouse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  is_active: boolean;
  pos_accnt_id: number;
  biller_id?: number; // Foreign key to biller
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  customer_group_id?: number;
  name: string;
  email?: string;
  phone_number?: string;
  location?: string;
  origin?: string;
  sub_county?: string;
  ward?: string;
  sublocation?: string;
  village?: string;
  MemberNo?: string;
  assigned?: number; // warehouse_id
  pos_accnt_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id: number;
  reference_no?: string;
  customer_id?: number;
  warehouse_id: number;
  biller_id: number;
  total_qty: number;
  total_discount: number;
  total_tax: number;
  grand_total: number;
  pos_accnt_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerGroup {
  id: number;
  name: string;
  percentage: number;
  is_active: boolean;
  pos_accnt_id: number;
}

export default pool;