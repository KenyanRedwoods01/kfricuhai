#!/usr/bin/env node

// Test script to verify Laravel API endpoints
const API_BASE = 'https://uhai.africa';

async function testEndpoint(name, endpoint, method = 'GET') {
    try {
        console.log(`\n🧪 Testing ${name}...`);
        console.log(`   URL: ${API_BASE}${endpoint}`);
        
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for session
        });

        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ Success! Data preview:`);
            console.log(`   ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
        } else {
            const errorText = await response.text();
            console.log(`   ❌ Error! Response:`);
            console.log(`   ${errorText.substring(0, 200)}...`);
        }
    } catch (error) {
        console.log(`   ❌ Connection Error:`);
        console.log(`   ${error.message}`);
    }
}

async function runTests() {
    console.log('🚀 Testing Laravel API Endpoints');
    console.log('====================================');
    
    // Test basic endpoints
    await testEndpoint('Customer Data', '/customer/data');
    await testEndpoint('Warehouse Data', '/warehouse/all');
    await testEndpoint('Biller Data', '/biller');
    await testEndpoint('Today Sale', '/sales/today-sale');
    
    // Test KPI endpoints (these might require authentication)
    await testEndpoint('KPI Dashboard', '/api/kpi/dashboard');
    
    console.log('\n====================================');
    console.log('✅ API Test Complete!');
}

runTests();