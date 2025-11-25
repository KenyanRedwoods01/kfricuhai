# Advanced Document Generation System - Complete Setup Guide

## Overview

This system provides comprehensive document generation capabilities including:

- **PDF Generation**: Create beautiful PDF reports with charts, tables, and custom formatting
- **Excel/Spreadsheet Generation**: Export data to Excel with advanced formatting and charts
- **Google Sheets Integration**: Real-time synchronization with Google Sheets
- **Google Drive Integration**: Automated file storage and sharing
- **Advanced UI Components**: Beautiful, responsive interfaces for data visualization
- **Download Management**: Queue-based download system with progress tracking
- **Document Formatting**: Professional styling and template systems

## Quick Start

### 1. Install Dependencies

```bash
cd nextjs
npm install
```

### 2. Environment Configuration

Copy the environment example and configure:

```bash
cp .env.local.example .env.local
```

Update the following variables:

```env
# Database Configuration
DB_HOST=uhai.africa
DB_PORT=3306
DB_DATABASE=uhaiafri_test_last
DB_USERNAME=uhaiafri_pos_api
DB_PASSWORD=PAunr5anBYL2kHTHxe2E

# Google APIs (Optional - for Google Sheets/Drive integration)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Start Development Server

```bash
npm run dev
```

Access the application at http://localhost:3000

### 4. Navigate to Documents

Visit http://localhost:3000/dashboard/documents to explore the document generation system.

## Features Overview

### 1. Document Generator (`/dashboard/documents`)

**Main Features:**
- PDF Dashboard Reports
- Excel Workbook Generation
- Google Sheets Synchronization
- Custom Report Builder

**How to Use:**
1. Open the Documents page
2. Select "Document Generator" tab
3. Choose document type (PDF, Excel, Google Sheets)
4. Configure options and generate

### 2. Interactive Spreadsheet (`/dashboard/documents`)

**Features:**
- Live data editing
- Advanced filtering and sorting
- Virtual scrolling for large datasets
- Cell-level formatting
- Real-time analytics

**How to Use:**
1. Go to Documents page
2. Select "Data Spreadsheet" tab
3. Edit cells directly
4. Use filters and search
5. Export data in multiple formats

### 3. Download Manager (`/dashboard/documents`)

**Features:**
- File download queue
- Progress tracking
- Upload management
- File type detection
- Batch operations

**How to Use:**
1. Visit Documents page
2. Select "Download Manager" tab
3. Monitor download progress
4. Manage file queue
5. Search and filter files

### 4. Data Analytics (`/dashboard/documents`)

**Features:**
- Document generation statistics
- Download trend analysis
- User engagement metrics
- Performance monitoring

**How to Use:**
1. Go to Documents page
2. Select "Data Analytics" tab
3. View generation metrics
4. Analyze download patterns
5. Monitor system performance

## Google APIs Setup (Optional)

### Google Sheets API

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing

2. **Enable Google Sheets API:**
   - Navigate to APIs & Services > Library
   - Search for "Google Sheets API"
   - Click Enable

3. **Create Credentials:**
   - Go to APIs & Services > Credentials
   - Click Create Credentials > OAuth 2.0 Client IDs
   - Choose "Web application"
   - Add authorized origins and redirect URIs

4. **Update Environment Variables:**
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### Google Drive API

1. **Enable Google Drive API:**
   - In Google Cloud Console, search "Google Drive API"
   - Enable the API

2. **Create Service Account:**
   - Go to IAM & Admin > Service Accounts
   - Create new service account
   - Download JSON key file

3. **Update Environment Variables:**
```env
GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-key\n-----END PRIVATE KEY-----\n"
```

## Advanced Features

### 1. PDF Generation

**Methods Available:**
- `PDFGenerator.generateFromHTML(elementId, options)`
- `PDFGenerator.generateFromData(data, headers, options)`
- `PDFGenerator.generateKPIDashboard(elementId, options)`

**Example Usage:**
```typescript
import { PDFGenerator } from '../utils/pdfGenerator';

// Generate PDF from HTML element
await PDFGenerator.generateFromHTML('kpi-dashboard', 'my-report.pdf', {
  format: 'a4',
  orientation: 'landscape',
  includeCharts: true
});

// Generate PDF from structured data
PDFGenerator.generateFromData(data, ['Name', 'Value'], 'data-report.pdf', {
  title: 'KPI Report',
  includePageNumbers: true
});
```

### 2. Excel Generation

**Methods Available:**
- `ExcelGenerator.generateKPIDashboard(kpiData)`
- `ExcelGenerator.exportRealtimeData(data, format)`
- `ExcelGenerator.createBeautifulTable(data, options)`

**Example Usage:**
```typescript
import { ExcelGenerator } from '../utils/excelGenerator';

// Generate comprehensive KPI dashboard
await ExcelGenerator.generateKPIDashboard(kpiData, 'kpi-dashboard.xlsx');

// Export data in different formats
ExcelGenerator.exportRealtimeData(data, 'xlsx', 'export.xlsx');
ExcelGenerator.exportRealtimeData(data, 'csv', 'export.csv');
ExcelGenerator.exportRealtimeData(data, 'json', 'export.json');
```

### 3. Google Integration

**Methods Available:**
- `GoogleSheetsService.createSpreadsheet(title, sheets)`
- `GoogleSheetsService.syncKPIData(spreadsheetId, kpiData)`
- `DocumentManager.createAndStoreDocument(options)`

**Example Usage:**
```typescript
import { GoogleSheetsService, DocumentManager } from '../services/googleIntegration';

// Create and sync spreadsheet
const spreadsheetId = await GoogleSheetsService.createSpreadsheet('KPI Dashboard', []);
await GoogleSheetsService.syncKPIData(spreadsheetId, kpiData);

// Complete workflow: Generate + Upload to Drive
const result = await DocumentManager.createAndStoreDocument({
  type: 'pdf',
  data: kpiData,
  title: 'Monthly KPI Report',
  shareWith: ['team@company.com']
});
```

### 4. Advanced Spreadsheet Component

**Props:**
```typescript
interface AdvancedSpreadsheetProps {
  data: any[];
  columns: Array<{
    id: string;
    label: string;
    type: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'boolean';
    editable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
  }>;
  onDataChange?: (data: any[]) => void;
  enableVirtualization?: boolean;
  maxHeight?: number;
}
```

**Example Usage:**
```typescript
<AdvancedSpreadsheet
  data={kpiData}
  columns={spreadsheetColumns}
  title="KPI Data Spreadsheet"
  onDataChange={(data) => setData(data)}
  enableVirtualization={true}
  maxHeight={600}
/>
```

## File Structure

```
nextjs/
├── components/
│   ├── AdvancedDocumentGenerator.tsx    # Main document generator UI
│   ├── AdvancedSpreadsheet.tsx          # Interactive spreadsheet component
│   ├── DocumentDownloadManager.tsx      # Download queue and file manager
│   └── AdvancedNavigation.tsx           # Navigation with documents section
├── utils/
│   ├── pdfGenerator.ts                  # PDF generation utilities
│   └── excelGenerator.ts                # Excel/spreadsheet generation
├── services/
│   └── googleIntegration.ts             # Google Sheets/Drive integration
├── pages/
│   └── dashboard/
│       ├── documents.tsx                # Main documents page
│       └── index.tsx                    # Updated with documents link
└── .env.local.example                   # Environment configuration
```

## Customization

### 1. Adding New Document Templates

```typescript
// In AdvancedDocumentGenerator.tsx
const templates = [
  {
    id: 'custom-report',
    name: 'Custom Report',
    description: 'Your custom template description',
    preview: '/api/placeholder/300/200',
    category: 'Business Intelligence',
    elements: ['Custom Elements']
  },
  // ... existing templates
];
```

### 2. Custom PDF Layouts

```typescript
// In pdfGenerator.ts
PDFGenerator.generateComplexDocument([
  {
    title: 'Custom Section',
    type: 'chart',
    content: 'chart-element-id'
  },
  {
    title: 'Data Table',
    type: 'table',
    content: {
      headers: ['Column 1', 'Column 2'],
      data: yourData
    }
  }
]);
```

### 3. Custom Column Types

```typescript
// Add new column types in AdvancedSpreadsheet.tsx
const formatCellValue = (value: any, type: string): string => {
  switch (type) {
    case 'custom-type':
      return formatCustomValue(value);
    // ... existing cases
  }
};
```

## Performance Optimization

### 1. Large Datasets

- Virtual scrolling for tables with 1000+ rows
- Pagination with configurable page sizes
- Lazy loading of chart data
- Debounced search and filtering

### 2. Document Generation

- Async PDF generation with progress tracking
- Batch Excel processing
- Cached Google API calls
- Optimized image processing

### 3. Memory Management

- Cleanup of generated documents
- Garbage collection for chart instances
- Efficient virtual scrolling
- Component unmounting cleanup

## Troubleshooting

### Common Issues

1. **PDF Generation Fails:**
   - Check if HTML element exists
   - Ensure proper CSS styling
   - Verify memory usage

2. **Google APIs Not Working:**
   - Verify credentials in .env.local
   - Check API key permissions
   - Ensure proper OAuth setup

3. **Excel Export Issues:**
   - Check data format compatibility
   - Verify memory constraints
   - Ensure proper MIME types

### Error Handling

All components include comprehensive error handling:

```typescript
try {
  await PDFGenerator.generateFromHTML(elementId);
} catch (error) {
  console.error('PDF generation failed:', error);
  // Show user-friendly error message
}
```

## Security Considerations

1. **API Keys:**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **File Upload:**
   - Validate file types
   - Scan for malicious content
   - Limit file sizes

3. **Data Privacy:**
   - Encrypt sensitive data
   - Use HTTPS for all requests
   - Implement proper access controls

## Support

For issues or questions:
1. Check the console for error messages
2. Verify environment configuration
3. Test with sample data
4. Review the troubleshooting section

---

**Created by MiniMax Agent** - Advanced Document Generation System v3.0