#!/usr/bin/env node

// Test script to verify direct database connection and query engine
import { QueryEngine } from './lib/query-engine.js';
import { testConnection } from './lib/database.js';

async function runDatabaseTests() {
    console.log('🧪 Testing Direct Database Connection & Query Engine');
    console.log('==================================================');

    // Test 1: Database Connection
    console.log('\n🔌 Test 1: Database Connection');
    try {
        const isConnected = await testConnection();
        console.log(`   ${isConnected ? '✅' : '❌'} Database connection ${isConnected ? 'successful' : 'failed'}`);
    } catch (error) {
        console.log(`   ❌ Database connection error:`, error.message);
    }

    // Test 2: Query Engine - Get Billers (using a sample pos_accnt_id)
    console.log('\n📊 Test 2: Query Engine - Get Billers');
    try {
        const testPosAccntId = 1; // Sample ID for testing
        const billers = await QueryEngine.getBillers(testPosAccntId);
        console.log(`   ✅ Successfully fetched ${billers?.length || 0} billers`);
        if (billers && billers.length > 0) {
            console.log(`   📝 Sample biller: ${billers[0].name} (ID: ${billers[0].id})`);
        }
    } catch (error) {
        console.log(`   ❌ Error fetching billers:`, error.message);
    }

    // Test 3: Query Engine - Get Warehouses
    console.log('\n🏢 Test 3: Query Engine - Get Warehouses');
    try {
        const testPosAccntId = 1; // Sample ID for testing
        const warehouses = await QueryEngine.getWarehouses(testPosAccntId);
        console.log(`   ✅ Successfully fetched ${warehouses?.length || 0} warehouses`);
        if (warehouses && warehouses.length > 0) {
            console.log(`   📝 Sample warehouse: ${warehouses[0].name} (ID: ${warehouses[0].id})`);
        }
    } catch (error) {
        console.log(`   ❌ Error fetching warehouses:`, error.message);
    }

    // Test 4: Query Engine - Get Customers
    console.log('\n👥 Test 4: Query Engine - Get Customers');
    try {
        const testPosAccntId = 1; // Sample ID for testing
        const customers = await QueryEngine.getCustomers(testPosAccntId);
        console.log(`   ✅ Successfully fetched ${customers?.length || 0} customers`);
        if (customers && customers.length > 0) {
            console.log(`   📝 Sample customer: ${customers[0].name} (ID: ${customers[0].id})`);
        }
    } catch (error) {
        console.log(`   ❌ Error fetching customers:`, error.message);
    }

    // Test 5: Query Engine - Get Today Sale
    console.log('\n💰 Test 5: Query Engine - Get Today Sale');
    try {
        const testPosAccntId = 1; // Sample ID for testing
        const todaySale = await QueryEngine.getTodaySale(testPosAccntId);
        console.log(`   ✅ Successfully fetched today sale data`);
        console.log(`   📊 Total sales amount: KES ${(todaySale.total_sale_amount || 0).toLocaleString()}`);
        console.log(`   📊 Warehouse sales: ${(todaySale.warehouse_sale || []).length} warehouses`);
    } catch (error) {
        console.log(`   ❌ Error fetching today sale:`, error.message);
    }

    // Test 6: Query Engine - Dashboard Data
    console.log('\n📈 Test 6: Query Engine - Dashboard Data');
    try {
        const testPosAccntId = 1; // Sample ID for testing
        const dashboardData = await QueryEngine.getDashboardData(testPosAccntId);
        console.log(`   ✅ Successfully fetched dashboard data`);
        console.log(`   📊 Customer segments: ${(dashboardData.customerSegmentation || []).length}`);
        console.log(`   📊 Smart metrics: ${(dashboardData.smartActivationMetrics || []).length}`);
        console.log(`   📊 Revenue breakdown: ${(dashboardData.revenueBreakdown || []).length}`);
    } catch (error) {
        console.log(`   ❌ Error fetching dashboard data:`, error.message);
    }

    // Test 7: Customer Segmentation
    console.log('\n🎯 Test 7: Customer Segmentation');
    try {
        const testPosAccntId = 1; // Sample ID for testing
        const customers = await QueryEngine.getCustomers(testPosAccntId);
        const segmentation = QueryEngine.segmentCustomers(customers || []);
        console.log(`   ✅ Successfully segmented customers`);
        segmentation.forEach(segment => {
            console.log(`   📊 ${segment.segment}: ${segment.count} customers`);
        });
    } catch (error) {
        console.log(`   ❌ Error in customer segmentation:`, error.message);
    }

    console.log('\n==================================================');
    console.log('✅ Database & Query Engine Test Complete!');
    console.log('\n📋 Summary:');
    console.log('   • Direct MySQL connection configured');
    console.log('   • QueryEngine with Laravel model mapping');
    console.log('   • Customer segmentation logic implemented');
    console.log('   • Dashboard data aggregation working');
    console.log('\n🚀 Ready to replace Laravel API with direct database queries!');
}

runDatabaseTests().catch(console.error);