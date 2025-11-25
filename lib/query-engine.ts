import { executeQuery, Biller, Warehouse, Customer, Sale, CustomerGroup } from './database';

// Query Engine - Direct Database Operations
export class QueryEngine {
  
  // Get all billers with filtering by pos_accnt_id
  static async getBillers(posAccntId: number): Promise<Biller[]> {
    const query = `
      SELECT 
        id, name, company_name, email, phone_number, address, pos_accnt_id, 
        is_active, created_at, updated_at
      FROM billers 
      WHERE pos_accnt_id = ? AND is_active = 1
      ORDER BY name ASC
    `;
    return await executeQuery(query, [posAccntId]) as Biller[];
  }

  // Get all warehouses with filtering by pos_accnt_id
  static async getWarehouses(posAccntId: number): Promise<Warehouse[]> {
    const query = `
      SELECT 
        w.id, w.name, w.phone, w.email, w.address, w.is_active, 
        w.pos_accnt_id, w.biller_id, w.created_at, w.updated_at
      FROM warehouses w
      WHERE w.pos_accnt_id = ? AND w.is_active = 1
      ORDER BY w.name ASC
    `;
    return await executeQuery(query, [posAccntId]) as Warehouse[];
  }

  // Get all customers with filtering by pos_accnt_id
  static async getCustomers(posAccntId: number): Promise<Customer[]> {
    const query = `
      SELECT 
        id, customer_group_id, name, email, phone_number, location, 
        origin, sub_county, ward, sublocation, village, MemberNo, 
        assigned, pos_accnt_id, created_at, updated_at
      FROM customers 
      WHERE pos_accnt_id = ?
      ORDER BY name ASC
    `;
    return await executeQuery(query, [posAccntId]) as Customer[];
  }

  // Get all customer groups
  static async getCustomerGroups(posAccntId: number): Promise<CustomerGroup[]> {
    const query = `
      SELECT 
        id, name, percentage, is_active, pos_accnt_id
      FROM customer_groups 
      WHERE pos_accnt_id = ? AND is_active = 1
      ORDER BY name ASC
    `;
    return await executeQuery(query, [posAccntId]) as CustomerGroup[];
  }

  // Get sales data for today with warehouse distribution
  static async getTodaySale(posAccntId: number): Promise<any> {
    const todayQuery = `
      SELECT 
        s.id, s.reference_no, s.customer_id, s.warehouse_id, s.biller_id,
        s.total_qty, s.total_discount, s.total_tax, s.grand_total,
        s.pos_accnt_id, s.created_at,
        c.name as customer_name,
        w.name as warehouse_name,
        b.name as biller_name
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN warehouses w ON s.warehouse_id = w.id
      LEFT JOIN billers b ON s.biller_id = b.id
      WHERE s.pos_accnt_id = ? 
        AND DATE(s.created_at) = CURDATE()
      ORDER BY s.created_at DESC
    `;
    
    const sales = await executeQuery(todayQuery, [posAccntId]);
    
    // Group by warehouse for summary
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
    
    const warehouseSales = await executeQuery(warehouseSummaryQuery, [posAccntId, posAccntId]);
    
    const totalSales = sales.reduce((sum: number, sale: any) => sum + (sale.grand_total || 0), 0);
    
    return {
      total_sale_amount: totalSales,
      warehouse_sale: warehouseSales,
      sales: sales
    };
  }

  // Get comprehensive dashboard data
  static async getDashboardData(posAccntId: number): Promise<any> {
    // Get customers with grouping
    const customers = await this.getCustomers(posAccntId);
    
    // Customer segmentation based on Laravel fields
    const customerSegmentation = this.segmentCustomers(customers);
    
    // Get sales trends (last 30 days)
    const salesTrendQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as sale_count,
        SUM(grand_total) as total_revenue,
        AVG(grand_total) as avg_order_value
      FROM sales 
      WHERE pos_accnt_id = ? 
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    
    const salesTrend = await executeQuery(salesTrendQuery, [posAccntId]);
    
    // Smart activation metrics
    const smartActivationMetrics = this.calculateSmartActivationMetrics(customers, salesTrend);
    
    // Revenue breakdown by warehouse
    const revenueBreakdownQuery = `
      SELECT 
        w.id as warehouse_id,
        w.name as warehouse_name,
        COUNT(s.id) as total_sales,
        SUM(s.grand_total) as total_revenue,
        COALESCE(AVG(s.grand_total), 0) as avg_sale_value,
        COALESCE(SUM(s.total_qty), 0) as total_quantity,
        COUNT(DISTINCT s.customer_id) as unique_customers
      FROM warehouses w
      LEFT JOIN sales s ON w.id = s.warehouse_id 
        AND s.pos_accnt_id = ?
        AND DATE(s.created_at) = CURDATE()
      WHERE w.pos_accnt_id = ? AND w.is_active = 1
      GROUP BY w.id, w.name
      ORDER BY total_revenue DESC
    `;
    
    const revenueBreakdown = await executeQuery(revenueBreakdownQuery, [posAccntId, posAccntId]);
    
    return {
      customerSegmentation,
      salesTrend,
      smartActivationMetrics,
      revenueBreakdown,
      timestamp: new Date().toISOString()
    };
  }

  // Customer segmentation logic (matching Laravel controller logic)
  static segmentCustomers(customers: Customer[]): any[] {
    const segments = {
      'Students': { count: 0, revenue: 0, customers: [] },
      'Villagers': { count: 0, revenue: 0, customers: [] },
      'Households': { count: 0, revenue: 0, customers: [] }
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
      revenue: data.revenue || 0,
      avgOrderValue: data.count > 0 ? (data.revenue || 0) / data.count : 0,
      loyaltyScore: Math.min(data.count * 10, 100), // Simple loyalty calculation
      growthRate: Math.random() * 20 - 10, // Placeholder - would need historical data
      warehouseDistribution: {} // Would need warehouse assignment data
    }));
  }

  // Calculate smart activation metrics
  static calculateSmartActivationMetrics(customers: Customer[], salesTrend: any[]): any[] {
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

  // Get KPI data for dashboard
  static async getKPIDashboard(): Promise<any> {
    // This would contain complex KPI calculations
    // For now, returning structure that matches Laravel KpiController
    return {
      grossProfitMargin: { value: 25.5, trend: 'up' },
      salesGrowthRate: { value: 12.3, trend: 'up' },
      inventoryTurnover: { value: 8.7, trend: 'stable' },
      customerLifetimeValue: { value: 1540.50, trend: 'up' },
      netProfitMargin: { value: 18.2, trend: 'up' },
      customerAcquisitionCost: { value: 125.75, trend: 'down' },
      customerRetentionRate: { value: 78.5, trend: 'stable' },
      salesForecast: { value: 125000, trend: 'up' },
      returnOnInvestment: { value: 22.1, trend: 'up' },
      customerChurnRate: { value: 5.8, trend: 'down' }
    };
  }
}

export default QueryEngine;