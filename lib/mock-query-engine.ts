#!/usr/bin/env node

import { MockDatabaseClient } from './mock-database';

// Query Engine - Direct Database Operations (Mock Version)
export class MockQueryEngine {
  
  // Get all billers with filtering by pos_accnt_id
  static async getBillers(posAccntId: number) {
    const query = `
      SELECT 
        id, name, company_name, email, phone_number, address, pos_accnt_id, 
        is_active, created_at, updated_at
      FROM billers 
      WHERE pos_accnt_id = ? AND is_active = 1
      ORDER BY name ASC
    `;
    return await MockDatabaseClient.executeQuery(query, [posAccntId]);
  }

  // Get all warehouses with filtering by pos_accnt_id
  static async getWarehouses(posAccntId: number) {
    const query = `
      SELECT 
        w.id, w.name, w.phone, w.email, w.address, w.is_active, 
        w.pos_accnt_id, w.biller_id, w.created_at, w.updated_at
      FROM warehouses w
      WHERE w.pos_accnt_id = ? AND w.is_active = 1
      ORDER BY w.name ASC
    `;
    return await MockDatabaseClient.executeQuery(query, [posAccntId]);
  }

  // Get all customers with filtering by pos_accnt_id
  static async getCustomers(posAccntId: number) {
    const query = `
      SELECT 
        id, customer_group_id, name, email, phone_number, location, 
        origin, sub_county, ward, sublocation, village, MemberNo, 
        assigned, pos_accnt_id, created_at, updated_at
      FROM customers 
      WHERE pos_accnt_id = ?
      ORDER BY name ASC
    `;
    return await MockDatabaseClient.executeQuery(query, [posAccntId]);
  }

  // Get sales data for today with warehouse distribution
  static async getTodaySale(posAccntId: number) {
    console.log('   📊 Getting today\'s sales data...');
    
    const warehouseSummaryQuery = `
      SELECT 
        w.id as warehouse_id,
        w.name as warehouse_name,
        COALESCE(SUM(s.grand_total), 0) as total_sales,
        COUNT(s.id) as sale_count,
        COALESCE(AVG(s.grand_total), 0) as avg_sale
      FROM warehouses w
      LEFT JOIN sales s ON w.id = s.warehouse_id 
        AND s.pos_accnt_id = ? 
        AND DATE(s.created_at) = CURDATE()
      WHERE w.pos_accnt_id = ? AND w.is_active = 1
      GROUP BY w.id, w.name
      ORDER BY total_sales DESC
    `;
    
    const warehouseSales = await MockDatabaseClient.executeQuery(warehouseSummaryQuery, [posAccntId, posAccntId]);
    const totalSales = warehouseSales.reduce((sum: number, w: any) => sum + (w.total_sales || 0), 0);
    
    return {
      total_sale_amount: totalSales,
      warehouse_sale: warehouseSales
    };
  }

  // Customer segmentation logic (matching Laravel controller logic)
  static segmentCustomers(customers: any[]) {
    const segments = {
      'Students': { count: 0, customers: [] },
      'Villagers': { count: 0, customers: [] },
      'Households': { count: 0, customers: [] }
    };

    customers.forEach(customer => {
      let segment = 'Households'; // Default
      
      // Student detection (based on Laravel logic)
      if (customer.origin?.toLowerCase().includes('student') || customer.MemberNo) {
        segment = 'Students';
      }
      // Villager detection
      else if (customer.village || customer.sub_county) {
        segment = 'Villagers';
      }

      segments[segment].count++;
      segments[segment].customers.push(customer);
    });

    // Calculate metrics for each segment
    return Object.entries(segments).map(([segmentName, data]: [string, any]) => ({
      segment: segmentName,
      count: data.count,
      revenue: 0, // Would need sales data to calculate
      avgOrderValue: 0,
      loyaltyScore: Math.min(data.count * 10, 100), // Simple loyalty calculation
      growthRate: Math.random() * 20 - 10, // Placeholder - would need historical data
      warehouseDistribution: {}
    }));
  }

  // Calculate smart activation metrics
  static calculateSmartActivationMetrics(customers: any[], salesTrend: any[]) {
    const totalCustomers = customers.length;
    const activeCustomers = salesTrend.reduce((sum, day) => sum + (day.sale_count || 0), 0);
    const activationRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;

    return [
      {
        metric: 'Customer Activation Rate',
        value: activationRate.toFixed(2),
        trend: activationRate > 60 ? 'up' : activationRate > 30 ? 'stable' : 'down',
        target: 75,
        description: 'Percentage of customers with recent activity'
      },
      {
        metric: 'Total Customers',
        value: totalCustomers.toString(),
        trend: 'stable',
        target: 1000,
        description: 'Total registered customers'
      },
      {
        metric: 'Active Customers (30d)',
        value: activeCustomers.toString(),
        trend: activeCustomers > totalCustomers * 0.3 ? 'up' : 'down',
        target: totalCustomers * 0.4,
        description: 'Customers with transactions in last 30 days'
      }
    ];
  }

  // Get comprehensive dashboard data
  static async getDashboardData(posAccntId: number) {
    // Get customers with grouping
    const customers = await this.getCustomers(posAccntId);
    
    // Customer segmentation based on Laravel fields
    const customerSegmentation = this.segmentCustomers(customers);
    
    // Mock sales trend data
    const salesTrend = [
      { date: '2025-11-20', sale_count: 45, total_revenue: 45000, avg_order_value: 1000 },
      { date: '2025-11-21', sale_count: 52, total_revenue: 52000, avg_order_value: 1000 },
      { date: '2025-11-22', sale_count: 38, total_revenue: 38000, avg_order_value: 1000 },
      { date: '2025-11-23', sale_count: 61, total_revenue: 61000, avg_order_value: 1000 },
      { date: '2025-11-24', sale_count: 49, total_revenue: 49000, avg_order_value: 1000 }
    ];
    
    // Smart activation metrics
    const smartActivationMetrics = this.calculateSmartActivationMetrics(customers, salesTrend);
    
    return {
      customerSegmentation,
      salesTrend,
      smartActivationMetrics,
      timestamp: new Date().toISOString()
    };
  }
}