#!/usr/bin/env node

// Mock Database Client for Testing - simulating MySQL connection
// In production, this would use actual mysql2/promise

// Mock database types
export interface MockBiller {
  id: number;
  name: string;
  company_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  pos_accnt_id: number;
  is_active: boolean;
}

export interface MockWarehouse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  is_active: boolean;
  pos_accnt_id: number;
  biller_id?: number;
}

export interface MockCustomer {
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
  assigned?: number;
  pos_accnt_id: number;
}

// Mock database connection
export class MockDatabaseClient {
  // Simulate database connection test
  static async testConnection(): Promise<boolean> {
    console.log('   🔌 Attempting connection to uhai.africa:3306...');
    console.log('   ✅ Connection successful (simulated)');
    return true;
  }

  // Mock executeQuery function
  static async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    console.log(`   📝 Executing query: ${query.substring(0, 50)}...`);
    console.log(`   🔍 Parameters: [${params.join(', ')}]`);
    
    // Return mock data based on query type
    if (query.includes('FROM billers')) {
      return [
        { id: 1, name: 'Demo Biller', company_name: 'Demo Corp', email: 'demo@biller.com', phone_number: '+1234567890', address: '123 Demo St', pos_accnt_id: 1, is_active: true },
        { id: 2, name: 'Test Biller', company_name: 'Test Ltd', email: 'test@biller.com', phone_number: '+0987654321', address: '456 Test Ave', pos_accnt_id: 1, is_active: true }
      ];
    }
    
    if (query.includes('FROM warehouses')) {
      return [
        { id: 1, name: 'Main Warehouse', phone: '+1111111111', email: 'main@warehouse.com', address: '789 Warehouse Rd', is_active: true, pos_accnt_id: 1, biller_id: 1 },
        { id: 2, name: 'East Warehouse', phone: '+2222222222', email: 'east@warehouse.com', address: '321 East Blvd', is_active: true, pos_accnt_id: 1, biller_id: 1 },
        { id: 3, name: 'West Warehouse', phone: '+3333333333', email: 'west@warehouse.com', address: '654 West St', is_active: true, pos_accnt_id: 1, biller_id: 2 }
      ];
    }
    
    if (query.includes('FROM customers')) {
      return [
        { id: 1, customer_group_id: 1, name: 'John Student', email: 'john@student.com', phone_number: '+4444444444', location: 'Campus', origin: 'student', MemberNo: 'STU001', assigned: 1, pos_accnt_id: 1 },
        { id: 2, customer_group_id: 1, name: 'Jane Villager', email: 'jane@village.com', phone_number: '+5555555555', village: 'Vilage A', sub_county: 'County 1', assigned: 1, pos_accnt_id: 1 },
        { id: 3, customer_group_id: 2, name: 'Bob Householder', email: 'bob@house.com', phone_number: '+6666666666', location: 'City Center', assigned: 2, pos_accnt_id: 1 },
        { id: 4, customer_group_id: 1, name: 'Alice Student', email: 'alice@student.com', phone_number: '+7777777777', origin: 'university student', MemberNo: 'STU002', assigned: 3, pos_accnt_id: 1 }
      ];
    }

    if (query.includes('FROM sales')) {
      return [
        { warehouse_id: 1, name: 'Main Warehouse', total_sales: 25000, sale_count: 25, avg_sale: 1000 },
        { warehouse_id: 2, name: 'East Warehouse', total_sales: 18500, sale_count: 18, avg_sale: 1027 },
        { warehouse_id: 3, name: 'West Warehouse', total_sales: 32000, sale_count: 28, avg_sale: 1142 }
      ];
    }
    
    return []; // Default empty result
  }
}