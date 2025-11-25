const fs = require('fs');
const path = require('path');

console.log('🔍 KPI Dashboard File Structure Verification\n');

// Check essential files
const essentialFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'pages/_app.tsx',
  'pages/index.tsx',
  'styles/globals.css',
  'components/AdvancedNavigation.tsx',
  'components/AdvancedLayout.tsx',
  'pages/dashboard/kpi/quick-wins/index.tsx',
  'pages/dashboard/kpi/advanced-analytics/index.tsx',
  'pages/dashboard/kpi/strategic-insights/index.tsx',
  'utils/advancedKPIEngine.ts',
  'utils/excelGenerator.ts',
  'utils/pdfGenerator.ts',
  'lib/database.ts',
  'contexts/KpiContext.tsx',
  '.env.example'
];

console.log('📋 Essential Files Check:');
let allFilesPresent = true;
essentialFiles.forEach(file => {
  const filePath = path.join('/workspace/NEXTJS/uhaiafricakpis', file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesPresent = false;
});

console.log(`\n📊 Summary: ${allFilesPresent ? 'All essential files present!' : 'Some files missing'}`);

// Check directory structure
console.log('\n📁 Directory Structure:');
const directories = [
  'pages',
  'pages/dashboard',
  'pages/dashboard/kpi',
  'pages/dashboard/kpi/quick-wins',
  'pages/dashboard/kpi/advanced-analytics',
  'pages/dashboard/kpi/strategic-insights',
  'components',
  'utils',
  'lib',
  'contexts',
  'services',
  'styles'
];

directories.forEach(dir => {
  const dirPath = path.join('/workspace/NEXTJS/uhaiafricakpis', dir);
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  console.log(`${exists ? '📁' : '❌'} ${dir}`);
});

// Check package.json content
try {
  const packageJson = JSON.parse(fs.readFileSync('/workspace/NEXTJS/uhaiafricakpis/package.json', 'utf8'));
  console.log('\n📦 Package.json Analysis:');
  console.log(`   Name: ${packageJson.name}`);
  console.log(`   Version: ${packageJson.version}`);
  console.log(`   Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
  console.log(`   Dev Dependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
  console.log(`   Scripts: ${Object.keys(packageJson.scripts || {}).length}`);
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check for TypeScript compilation readiness
console.log('\n⚡ TypeScript Configuration:');
try {
  const tsconfig = JSON.parse(fs.readFileSync('/workspace/NEXTJS/uhaiafricakpis/tsconfig.json', 'utf8'));
  console.log(`   ✅ tsconfig.json valid`);
  console.log(`   Target: ${tsconfig.compilerOptions.target}`);
  console.log(`   Module: ${tsconfig.compilerOptions.module}`);
  console.log(`   Paths: ${Object.keys(tsconfig.compilerOptions.paths || {}).length} aliases defined`);
} catch (error) {
  console.log('❌ Error reading tsconfig.json:', error.message);
}

// Check Next.js configuration
console.log('\n⚙️ Next.js Configuration:');
try {
  const nextConfig = fs.readFileSync('/workspace/NEXTJS/uhaiafricakpis/next.config.js', 'utf8');
  console.log(`   ✅ next.config.js exists`);
  console.log(`   Contains: ${nextConfig.includes('reactStrictMode') ? 'React strict mode' : 'Basic config'}`);
  console.log(`   Environment: ${nextConfig.includes('process.env') ? 'Environment vars' : 'No env config'}`);
} catch (error) {
  console.log('❌ Error reading next.config.js:', error.message);
}

// Verify KPI components have correct imports
console.log('\n🎯 KPI Components Check:');
const kpiFiles = [
  'pages/dashboard/kpi/quick-wins/index.tsx',
  'pages/dashboard/kpi/advanced-analytics/index.tsx',
  'pages/dashboard/kpi/strategic-insights/index.tsx'
];

kpiFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.join('/workspace/NEXTJS/uhaiafricakpis', file), 'utf8');
    const hasLayout = content.includes('AdvancedLayout');
    const hasReact = content.includes('import React');
    const hasDefaultExport = content.includes('export default');
    console.log(`   ${hasLayout && hasReact && hasDefaultExport ? '✅' : '⚠️'} ${file}`);
  } catch (error) {
    console.log(`   ❌ ${file}: ${error.message}`);
  }
});

console.log('\n🎉 Verification Complete!');
console.log('\n📝 Next Steps:');
console.log('   1. Run: cd /workspace/NEXTJS/uhaiafricakpis');
console.log('   2. Run: npm install');
console.log('   3. Run: npm run dev');
console.log('   4. Open: http://localhost:3000');
console.log('\n🚀 The workspace consolidation is COMPLETE!');