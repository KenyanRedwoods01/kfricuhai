import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { api } from "@/lib/trpc/client";
import { TRPCError } from "@trpc/server";
import QueryEngine from "@/lib/query-engine";
import { testConnection } from "@/lib/database";

// Types matching Laravel models
export interface Biller {
  id: number;
  name: string;
  company_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  vat_number: string;
  pos_accnt_id: number;
  is_active: boolean;
}

export interface Warehouse {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  pos_accnt_id: number;
  is_active: boolean;
  // Adding the hierarchical fields for our structure
  biller_id?: number;
  warehouse_id?: number;
  revenue?: number;
  totalOrders?: number;
  activeCustomers?: number;
}

export interface Customer {
  id: number;
  customer_group_id: number;
  name: string;
  company_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  location: string;
  points: number;
  LoyaltyPoints: number;
  wishlist: string;
  origin: string;
  sub_county: string;
  ward: string;
  sublocation: string;
  village: string;
  next_of_kin: string;
  MemberNo: string;
  next_of_kin_mobile: string;
  next_of_kin_relationship: string;
  INPL: string;
  is_active: boolean;
  pos_accnt_id: number;
  assigned: number;
}

export interface CustomerGroup {
  id: number;
  name: string;
  percentage: number;
  is_active: boolean;
  pos_accnt_id: number;
}

export interface Sale {
  id: number;
  reference_no: string;
  biller_id: number;
  warehouse_id: number;
  customer_id: number;
  total_qty: number;
  total_discount: number;
  total_tax: number;
  total_price: number;
  grand_total: number;
  order_tax_rate: number;
  order_tax: number;
  order_discount: number;
  sale_status: number;
  payment_status: number;
  created_at: string;
  updated_at: string;
}

export interface SmartActivationMetrics {
  totalGroups: number;
  activeGroups: number;
  avgActivationRate: number;
  totalMembers: number;
  avgRevenue: number;
  topPerformingGroup: string;
  growthRate: number;
}

export interface CustomerSegmentation {
  segment: string;
  count: number;
  revenue: number;
  avgOrderValue: number;
  loyaltyScore: number;
  growthRate: number;
  warehouseDistribution: { [key: number]: number };
}

export interface RevenueBreakdown {
  warehouse: string;
  warehouseId: number;
  totalRevenue: number;
  revenueByCustomerType: {
    students: number;
    villagers: number;
    households: number;
  };
  growthRate: number;
  marketShare: number;
}

export interface AnalyticsReport {
  id: string;
  title: string;
  type: 'revenue' | 'customer' | 'activation' | 'performance';
  generatedAt: Date;
  data: any;
  warehouseIds: number[];
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Direct Database Client - replaces Laravel API with direct MySQL queries
class DirectDatabaseClient {
  constructor() {
    // Initialize database connection on creation
    this.initConnection();
  }

  private async initConnection() {
    try {
      await testConnection();
      console.log('✅ Direct database connection initialized');
    } catch (error) {
      console.error('❌ Failed to initialize database connection:', error);
    }
  }

  // Billers - Direct database query
  async getBillers(posAccntId: number) {
    return await QueryEngine.getBillers(posAccntId);
  }

  async getBillerById(id: number) {
    const query = `
      SELECT * FROM billers 
      WHERE id = ? AND is_active = 1
      LIMIT 1
    `;
    const { executeQuery } = await import('@/lib/database');
    const results = await executeQuery(query, [id]);
    return results[0] || null;
  }

  // Warehouses - Direct database query
  async getWarehouses(posAccntId: number) {
    return await QueryEngine.getWarehouses(posAccntId);
  }

  async getWarehouseById(id: number) {
    const query = `
      SELECT * FROM warehouses 
      WHERE id = ? AND is_active = 1
      LIMIT 1
    `;
    const { executeQuery } = await import('@/lib/database');
    const results = await executeQuery(query, [id]);
    return results[0] || null;
  }

  // Customers - Direct database query
  async getCustomers(posAccntId: number) {
    return await QueryEngine.getCustomers(posAccntId);
  }

  async getCustomersByWarehouse(warehouseId: number, posAccntId: number) {
    const customers = await this.getCustomers(posAccntId);
    return customers.filter(customer => 
      customer.assigned === warehouseId || 
      (customer as any).warehouse_id === warehouseId
    );
  }

  // Sales - Direct database query
  async getSales(params: {
    posAccntId: number;
    warehouseId?: number;
    billerId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const { executeQuery } = await import('@/lib/database');
    
    let query = `
      SELECT s.*, c.name as customer_name, w.name as warehouse_name, b.name as biller_name
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN warehouses w ON s.warehouse_id = w.id
      LEFT JOIN billers b ON s.biller_id = b.id
      WHERE s.pos_accnt_id = ?
    `;
    const queryParams = [params.posAccntId];

    if (params.warehouseId) {
      query += ' AND s.warehouse_id = ?';
      queryParams.push(params.warehouseId.toString());
    }

    if (params.billerId) {
      query += ' AND s.biller_id = ?';
      queryParams.push(params.billerId.toString());
    }

    if (params.startDate) {
      query += ' AND DATE(s.created_at) >= ?';
      queryParams.push(params.startDate);
    }

    if (params.endDate) {
      query += ' AND DATE(s.created_at) <= ?';
      queryParams.push(params.endDate);
    }

    query += ' ORDER BY s.created_at DESC LIMIT 1000';

    return await executeQuery(query, queryParams);
  }

  // Today sale data - Direct database query
  async getTodaySale(posAccntId: number, warehouseId?: number) {
    return await QueryEngine.getTodaySale(posAccntId);
  }

  // KPI Dashboard - Direct database query
  async getKPIDashboard() {
    return await QueryEngine.getKPIDashboard();
  }

  async getKPI(kpiType: string) {
    // For now, return placeholder KPI data
    // In production, this would calculate specific KPIs from database
    return {
      value: Math.random() * 100,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString()
    };
  }

  // Reports - Direct database query
  async getReports(params: {
    posAccntId: number;
    warehouseId?: number;
    type?: string;
  }) {
    // For now, return basic sales report data
    return await this.getSales({ posAccntId: params.posAccntId });
  }

  // Customer Groups - Direct database query
  async getCustomerGroups(posAccntId: number) {
    return await QueryEngine.getCustomerGroups(posAccntId);
  }

  // Dashboard filter - Direct database query
  async getDashboardFilter(params: {
    startDate: string;
    endDate: string;
    warehouseId?: number;
    billerId?: number;
    posAccntId: number;
  }) {
    return await this.getSales({
      posAccntId: params.posAccntId,
      warehouseId: params.warehouseId,
      billerId: params.billerId,
      startDate: params.startDate,
      endDate: params.endDate
    });
  }

  // Revenue data - Direct database query
  async getRevenueData(params: {
    posAccntId: number;
    warehouseId?: number;
    billerId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    return await this.getSales({
      posAccntId: params.posAccntId,
      warehouseId: params.warehouseId,
      billerId: params.billerId,
      startDate: params.startDate,
      endDate: params.endDate
    });
  }
}

// Initialize Direct Database Client
const apiClient = new DirectDatabaseClient();

export const corporateRouter = createTRPCRouter({
  // Billers
  getBillers: protectedProcedure
    .input(z.object({
      posAccntId: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const billers = await apiClient.getBillers(input.posAccntId);
        return billers.data || billers; // Handle Laravel response structure
      } catch (error) {
        console.error('Error fetching billers:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch billers',
        });
      }
    }),

  getBiller: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const biller = await apiClient.getBillerById(input.id);
        return biller.data || biller;
      } catch (error) {
        console.error('Error fetching biller:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch biller',
        });
      }
    }),

  // Warehouses
  getWarehouses: protectedProcedure
    .input(z.object({
      posAccntId: z.number(),
      billerId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const warehouses = await apiClient.getWarehouses(input.posAccntId);
        let warehouseData = warehouses.data || warehouses;
        
        // Apply biller filter if provided
        if (input.billerId) {
          warehouseData = warehouseData.filter((w: Warehouse) => w.biller_id === input.billerId);
        }

        return warehouseData;
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch warehouses',
        });
      }
    }),

  // Customers
  getCustomers: protectedProcedure
    .input(z.object({
      posAccntId: z.number(),
      warehouseId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const customers = await apiClient.getCustomers(input.posAccntId);
        let customerData = customers.data || customers;
        
        // Apply warehouse filter if provided
        if (input.warehouseId) {
          customerData = customerData.filter((c: Customer) => c.assigned === input.warehouseId);
        }

        return customerData;
      } catch (error) {
        console.error('Error fetching customers:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch customers',
        });
      }
    }),

  getCustomerGroups: protectedProcedure
    .input(z.object({
      posAccntId: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const groups = await apiClient.getCustomerGroups(input.posAccntId);
        return groups.data || groups;
      } catch (error) {
        console.error('Error fetching customer groups:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch customer groups',
        });
      }
    }),

  // Sales & Revenue Data
  getSalesData: protectedProcedure
    .input(z.object({
      posAccntId: z.number(),
      warehouseId: z.number().optional(),
      billerId: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        // Use today-sale for dashboard overview, or full sales for detailed analysis
        const sales = input.warehouseId || input.billerId || input.startDate || input.endDate
          ? await apiClient.getSales(input)
          : await apiClient.getTodaySale(input.posAccntId, input.warehouseId);

        // Transform Laravel response to our format
        const salesData = sales.data || sales;
        
        // Handle both array and object responses
        if (Array.isArray(salesData)) {
          return salesData.map((sale: any) => ({
            id: sale.id,
            reference_no: sale.reference_no,
            customer_id: sale.customer_id,
            warehouse_id: sale.warehouse_id,
            biller_id: sale.biller_id,
            total_qty: sale.total_qty,
            total_discount: sale.total_discount,
            total_tax: sale.total_tax,
            total_price: sale.total_price,
            grand_total: sale.grand_total,
            sale_status: sale.sale_status,
            payment_status: sale.payment_status,
            created_at: new Date(sale.created_at),
            pos_accnt_id: sale.pos_accnt_id,
          }));
        } else if (salesData.total_sale_amount !== undefined) {
          // Handle today-sale response format
          return {
            totalRevenue: salesData.total_sale_amount || 0,
            totalPayment: salesData.total_payment || 0,
            saleCount: salesData.total_sale || 0,
            warehouseRevenue: salesData.warehouse_sale || [],
          };
        }

        return salesData;
      } catch (error) {
        console.error('Error fetching sales data:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch sales data',
        });
      }
    }),

  // KPI Data
  getKPIData: protectedProcedure
    .input(z.object({
      kpiType: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        if (input.kpiType) {
          const kpi = await apiClient.getKPI(input.kpiType);
          return kpi.data || kpi;
        } else {
          const dashboard = await apiClient.getKPIDashboard();
          return dashboard.data || dashboard;
        }
      } catch (error) {
        console.error('Error fetching KPI data:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch KPI data',
        });
      }
    }),

  // Analytics & Reports
  getAnalyticsReports: protectedProcedure
    .input(z.object({
      posAccntId: z.number(),
      warehouseId: z.number().optional(),
      type: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const reports = await apiClient.getReports(input);
        return reports.data || reports;
      } catch (error) {
        console.error('Error fetching analytics reports:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch analytics reports',
        });
      }
    }),

  // Corporate Dashboard Aggregated Data
  getCorporateDashboardData: protectedProcedure
    .input(z.object({
      posAccntId: z.number(),
      selectedBiller: z.string().optional(),
      selectedWarehouse: z.string().optional(),
      dateRange: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const {
          posAccntId,
          selectedBiller,
          selectedWarehouse,
          dateRange
        } = input;

        // Fetch dashboard data using QueryEngine
        const dashboardData = await QueryEngine.getDashboardData(posAccntId);
        
        // Fetch base entities
        const [billers, warehouses, customers, todaySale] = await Promise.all([
          apiClient.getBillers(posAccntId),
          apiClient.getWarehouses(posAccntId),
          apiClient.getCustomers(posAccntId),
          apiClient.getTodaySale(posAccntId)
        ]);

        // Apply hierarchical filters
        let filteredWarehouses = warehouses || [];
        if (selectedBiller && selectedBiller !== 'all') {
          filteredWarehouses = filteredWarehouses.filter((w: any) => 
            w.biller_id?.toString() === selectedBiller
          );
        }

        if (selectedWarehouse && selectedWarehouse !== 'all') {
          filteredWarehouses = filteredWarehouses.filter((w: any) => 
            w.id?.toString() === selectedWarehouse
          );
        }

        // Customer segmentation from dashboard data
        const customerSegmentation = dashboardData.customerSegmentation || [];
        // Apply warehouse filtering
        const warehouseIds = filteredWarehouses.map((w: any) => w.id);

        // Filter customers by selected warehouses
        const filteredCustomers = customers.filter((c: any) => 
          !selectedWarehouse || warehouseIds.includes(c.assigned)
        );

        // Calculate aggregated metrics
        const totalRevenue = (todaySale.total_sale_amount || 0);
        const totalOrders = (todaySale.warehouse_sale || []).reduce((sum: number, w: any) => sum + (w.sale_count || 0), 0);
        const totalCustomers = filteredCustomers.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Return structured response
        return {
          billers: billers || [],
          warehouses: filteredWarehouses,
          customers: filteredCustomers,
          dashboardData: {
            ...dashboardData,
            totalRevenue,
            totalOrders,
            totalCustomers,
            avgOrderValue
          },
          smartActivationMetrics,
          customerSegmentation,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching corporate dashboard data:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch corporate dashboard data',
        });
      }
    }),

  // Smart Activation Metrics
  getSmartActivationMetrics: protectedProcedure
    .input(z.object({
      posAccntId: z.number(),
      selectedBiller: z.string().optional(),
      selectedWarehouse: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        // Get customer and sales data
        const [customers, sales] = await Promise.all([
          apiClient.getCustomers(input.posAccntId),
          apiClient.getTodaySale(input.posAccntId, input.selectedWarehouse ? parseInt(input.selectedWarehouse) : undefined)
        ]);
        
        const customerData = Array.isArray(customers) ? customers : (customers.data || customers || []);
        const salesData = sales.warehouse_sale || [];
        
        // Calculate smart activation metrics based on grouped customers
        const totalGroups = Math.ceil(customerData.length / 10); // Example calculation
        const activeGroups = Math.floor(totalGroups * 0.8); // Example calculation
        const avgActivationRate = 85.2; // Placeholder - would be calculated from actual activation data
        const totalMembers = customerData.length;
        const avgRevenue = salesData.length > 0 ? 
          salesData.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0) / salesData.length : 0;
        
        return {
          totalGroups,
          activeGroups,
          avgActivationRate,
          totalMembers,
          avgRevenue,
          topPerformingGroup: 'University of Nairobi Student Association', // Placeholder
          growthRate: 23.5 // Placeholder
        };
      } catch (error) {
        console.error('Error fetching smart activation metrics:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch smart activation metrics',
        });
      }
    }),
});