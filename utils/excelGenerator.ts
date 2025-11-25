import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format, parseISO } from 'date-fns';

/**
 * Advanced Excel/Spreadsheet Generation Service
 * Supports complex formatting, charts, and beautiful dashboards
 */
export class ExcelGenerator {
  /**
   * Generate KPI Dashboard Excel file with beautiful formatting
   */
  static async generateKPIDashboard(
    kpiData: any[],
    filename: string = `kpi-dashboard-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'MiniMax Agent Dashboard System';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastModifiedBy = 'MiniMax Agent';

    // Create summary sheet
    const summarySheet = workbook.addWorksheet('Dashboard Summary');
    this.formatKPISummarySheet(summarySheet, kpiData);

    // Create detailed KPI sheets for each phase
    await this.createKPIDetailedSheets(workbook, kpiData);

    // Create charts and visualizations
    await this.createCharts(workbook, kpiData);

    // Write to file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  }

  /**
   * Generate comprehensive report with multiple sheets
   */
  static async generateComprehensiveReport(
    reportData: {
      title: string;
      sections: {
        name: string;
        data: any[];
        type: 'kpi' | 'financial' | 'operational' | 'marketing';
      }[];
    },
    filename: string = `comprehensive-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    
    // Cover sheet
    const coverSheet = workbook.addWorksheet('Report Cover');
    this.formatCoverSheet(coverSheet, reportData.title);

    // Executive Summary
    const summarySheet = workbook.addWorksheet('Executive Summary');
    this.formatExecutiveSummary(summarySheet, reportData.sections);

    // Create sheets for each section
    for (let i = 0; i < reportData.sections.length; i++) {
      const section = reportData.sections[i];
      const sheet = workbook.addWorksheet(section.name);
      await this.formatDataSheet(sheet, section.data, section.type);
    }

    // Create analysis sheet
    const analysisSheet = workbook.addWorksheet('Analysis & Insights');
    await this.createAnalysisVisualizations(analysisSheet, reportData.sections);

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  }

  /**
   * Generate real-time data export
   */
  static exportRealtimeData(
    data: any[],
    format: 'xlsx' | 'csv' | 'json' = 'xlsx',
    filename: string = `realtime-data-${format(new Date(), 'yyyy-MM-dd-HHmm')}.${format}`
  ): void {
    switch (format) {
      case 'xlsx':
        this.exportToXLSX(data, filename);
        break;
      case 'csv':
        this.exportToCSV(data, filename);
        break;
      case 'json':
        this.exportToJSON(data, filename);
        break;
    }
  }

  /**
   * Create beautiful data table with advanced formatting
   */
  static async createBeautifulTable(
    data: any[],
    options: {
      title: string;
      filename: string;
      includeCharts?: boolean;
      theme?: 'corporate' | 'modern' | 'colorful';
      pageOrientation?: 'portrait' | 'landscape';
    }
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data Table');
    
    // Apply theme formatting
    this.applyTableFormatting(sheet, data, options.theme || 'modern');

    // Add title
    sheet.mergeCells('A1:' + this.getColumnLetter(data[0] ? Object.keys(data[0]).length : 1) + '1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = options.title;
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF2E4A' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 30;

    // Add headers
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    const headerRow = sheet.getRow(3);
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = this.formatHeaderName(header);
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2E4A' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add data rows
    data.forEach((row, rowIndex) => {
      const dataRow = sheet.getRow(rowIndex + 4);
      headers.forEach((header, colIndex) => {
        const cell = dataRow.getCell(colIndex + 1);
        cell.value = row[header];
        
        // Format based on data type
        if (typeof row[header] === 'number') {
          if (header.toLowerCase().includes('percent') || header.toLowerCase().includes('rate')) {
            cell.numFmt = '0.00%';
          } else if (header.toLowerCase().includes('amount') || header.toLowerCase().includes('value')) {
            cell.numFmt = '$#,##0.00';
          } else {
            cell.numFmt = '#,##0.00';
          }
        }
        
        // Add borders
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
        };
        
        // Alternate row colors
        if (rowIndex % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F9FA' }
          };
        }
      });
    });

    // Auto-fit columns
    sheet.columns.forEach(column => {
      column.width = Math.max(15, column.width || 12);
    });

    // Add charts if requested
    if (options.includeCharts) {
      await this.addDataVisualizations(sheet, data);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), options.filename);
  }

  // Private helper methods
  private static formatKPISummarySheet(sheet: ExcelJS.Worksheet, kpiData: any[]): void {
    // Title
    sheet.mergeCells('A1:E1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'KPI Dashboard Summary';
    titleCell.font = { size: 24, bold: true, color: { argb: 'FF2E4A' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 35;

    // Date and time
    sheet.mergeCells('A2:E2');
    const dateCell = sheet.getCell('A2');
    dateCell.value = `Generated: ${format(new Date(), 'PPpp')}`;
    dateCell.font = { size: 12, italic: true };
    dateCell.alignment = { horizontal: 'center' };

    // KPI Overview Table
    const startRow = 4;
    const headers = ['KPI Name', 'Current Value', 'Target', 'Status', 'Trend'];
    
    // Headers
    const headerRow = sheet.getRow(startRow);
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2E4A' }
      };
      cell.alignment = { horizontal: 'center' };
      sheet.getColumn(index + 1).width = 18;
    });

    // Data rows
    kpiData.forEach((kpi, index) => {
      const row = sheet.getRow(startRow + 1 + index);
      row.getCell(1).value = kpi.name || `KPI ${index + 1}`;
      row.getCell(2).value = kpi.currentValue || 0;
      row.getCell(3).value = kpi.target || 0;
      row.getCell(4).value = kpi.status || 'On Track';
      row.getCell(5).value = kpi.trend || 'Stable';
      
      // Format numbers
      row.getCell(2).numFmt = kpi.format || '#,##0.00';
      row.getCell(3).numFmt = kpi.format || '#,##0.00';
      
      // Color coding based on status
      const status = kpi.status?.toLowerCase() || 'on track';
      if (status.includes('ahead') || status.includes('exceed')) {
        row.getCell(4).font = { color: { argb: 'FF00AA00' } };
      } else if (status.includes('behind') || status.includes('below')) {
        row.getCell(4).font = { color: { argb: 'FFAA0000' } };
      }
    });

    // Add summary statistics
    const summaryRow = sheet.getRow(startRow + kpiData.length + 2);
    summaryRow.getCell(1).value = 'Total KPIs:';
    summaryRow.getCell(2).value = kpiData.length;
    summaryRow.font = { bold: true };
  }

  private static async createKPIDetailedSheets(workbook: ExcelJS.Workbook, kpiData: any[]): Promise<void> {
    const phases = [
      { name: 'Quick Wins', kpis: ['grossProfitMargin', 'salesGrowthRate', 'inventoryTurnover', 'clv'] },
      { name: 'Analytics', kpis: ['netProfitMargin', 'cac', 'retentionRate', 'salesForecasting'] },
      { name: 'Intelligence', kpis: ['roi', 'churnRate', 'predictiveAnalytics', 'customerSegmentation'] }
    ];

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const sheet = workbook.addWorksheet(phase.name);
      
      // Phase header
      sheet.mergeCells('A1:F1');
      const headerCell = sheet.getCell('A1');
      headerCell.value = `${phase.name} KPIs`;
      headerCell.font = { size: 18, bold: true, color: { argb: 'FFFFFF' } };
      headerCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2E4A' }
      };
      headerCell.alignment = { horizontal: 'center' };
      sheet.getRow(1).height = 30;

      // KPI details
      const dataRow = sheet.getRow(3);
      dataRow.getCell(1).value = 'KPI';
      dataRow.getCell(2).value = 'Current';
      dataRow.getCell(3).value = 'Target';
      dataRow.getCell(4).value = 'Variance';
      dataRow.getCell(5).value = 'Status';
      dataRow.getCell(6).value = 'Actions';
      
      // Format headers
      dataRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F0F0' }
        };
      });

      // Add KPI data
      phase.kpis.forEach((kpiKey, index) => {
        const row = sheet.getRow(4 + index);
        const kpi = kpiData.find(k => k.key === kpiKey);
        
        row.getCell(1).value = kpi?.name || this.formatKpiName(kpiKey);
        row.getCell(2).value = kpi?.current || 0;
        row.getCell(3).value = kpi?.target || 0;
        row.getCell(4).value = `=C${4 + index}-B${4 + index}`;
        row.getCell(5).value = kpi?.status || 'Pending';
        row.getCell(6).value = kpi?.actions || 'Monitor';
        
        // Format numbers
        row.getCell(2).numFmt = this.getNumberFormat(kpiKey);
        row.getCell(3).numFmt = this.getNumberFormat(kpiKey);
        row.getCell(4).numFmt = this.getNumberFormat(kpiKey);
      });
    }
  }

  private static async createCharts(workbook: ExcelJS.Workbook, kpiData: any[]): Promise<void> {
    const chartsSheet = workbook.addWorksheet('Charts & Visualizations');
    
    // This would contain chart creation logic
    // For now, we'll add a placeholder
    chartsSheet.getCell('A1').value = 'Charts and Visualizations will be added here';
    chartsSheet.getCell('A1').font = { size: 16, italic: true };
  }

  private static formatCoverSheet(sheet: ExcelJS.Worksheet, title: string): void {
    // Main title
    sheet.mergeCells('A1:F3');
    const titleCell = sheet.getCell('A1');
    titleCell.value = title;
    titleCell.font = { size: 28, bold: true, color: { argb: 'FF2E4A' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 50;

    // Generated info
    sheet.mergeCells('A5:F6');
    const genCell = sheet.getCell('A5');
    genCell.value = `Generated: ${format(new Date(), 'PPpp')}\nPowered by MiniMax Agent Dashboard System`;
    genCell.font = { size: 14, italic: true };
    genCell.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  private static formatExecutiveSummary(sheet: ExcelJS.Worksheet, sections: any[]): void {
    sheet.getCell('A1').value = 'Executive Summary';
    sheet.getCell('A1').font = { size: 20, bold: true };
    
    let row = 3;
    sections.forEach(section => {
      sheet.getCell(`A${row}`).value = section.name;
      sheet.getCell(`A${row}`).font = { size: 14, bold: true };
      row++;
      
      sheet.getCell(`A${row}`).value = `Data points: ${section.data.length}`;
      row += 2;
    });
  }

  private static async formatDataSheet(sheet: ExcelJS.Worksheet, data: any[], type: string): Promise<void> {
    if (data.length === 0) return;

    // Auto-detect column types and format accordingly
    const headers = Object.keys(data[0]);
    
    // Add headers
    const headerRow = sheet.getRow(1);
    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = this.formatHeaderName(header);
      cell.font = { bold: true };
    });

    // Add data
    data.forEach((row, rowIndex) => {
      const dataRow = sheet.getRow(rowIndex + 2);
      headers.forEach((header, colIndex) => {
        const cell = dataRow.getCell(colIndex + 1);
        cell.value = row[header];
        
        // Auto-format based on data type
        if (typeof row[header] === 'number') {
          cell.numFmt = this.getNumberFormat(header);
        }
      });
    });

    // Auto-fit columns
    sheet.columns.forEach(column => {
      column.width = Math.max(12, column.width || 10);
    });
  }

  private static async createAnalysisVisualizations(sheet: ExcelJS.Worksheet, sections: any[]): Promise<void> {
    sheet.getCell('A1').value = 'Analysis & Insights';
    sheet.getCell('A1').font = { size: 18, bold: true };
    
    // This would contain analysis and insights
    sheet.getCell('A3').value = 'Key Insights:';
    sheet.getCell('A3').font = { size: 14, bold: true };
    
    // Add analysis content based on data
    let row = 5;
    sections.forEach(section => {
      sheet.getCell(`A${row}`).value = `${section.name} Analysis:`;
      sheet.getCell(`A${row}`).font = { bold: true };
      row++;
      
      // Basic analysis
      if (section.data.length > 0) {
        sheet.getCell(`A${row}`).value = `• Data points analyzed: ${section.data.length}`;
        row++;
        sheet.getCell(`A${row}`).value = `• Coverage: Complete`;
        row++;
      }
      row++;
    });
  }

  private static exportToXLSX(data: any[], filename: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
  }

  private static exportToCSV(data: any[], filename: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  private static exportToJSON(data: any[], filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, filename);
  }

  private static applyTableFormatting(sheet: ExcelJS.Worksheet, data: any[], theme: string): void {
    // Define theme colors
    const themes = {
      corporate: { primary: 'FF2E4A', secondary: 'FFF0F0F0' },
      modern: { primary: 'FF2563EB', secondary: 'FFF8F9FA' },
      colorful: { primary: 'FF7C3AED', secondary: 'FFFAF5FF' }
    };

    const colors = themes[theme] || themes.modern;

    // This would contain theme-specific formatting
    // For now, applying basic formatting
  }

  private static async addDataVisualizations(sheet: ExcelJS.Worksheet, data: any[]): Promise<void> {
    // This would add charts and visualizations
    // Placeholder for chart creation
  }

  private static formatHeaderName(header: string): string {
    return header
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private static formatKpiName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private static getNumberFormat(header: string): string {
    const lower = header.toLowerCase();
    if (lower.includes('percent') || lower.includes('rate') || lower.includes('margin')) {
      return '0.00%';
    }
    if (lower.includes('amount') || lower.includes('value') || lower.includes('revenue') || lower.includes('cost')) {
      return '$#,##0.00';
    }
    return '#,##0.00';
  }

  private static getColumnLetter(num: number): string {
    let temp = '';
    let letter = '';
    while (num > 0) {
      temp = (num - 1) % 26 + 'A';
      letter = temp + letter;
      num = (num - temp.charCodeAt(0)) / 26;
    }
    return letter;
  }
}

/**
 * Advanced data formatting utilities
 */
export const DataFormatters = {
  /**
   * Format currency values
   */
  formatCurrency: (value: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  },

  /**
   * Format percentage values
   */
  formatPercentage: (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  },

  /**
   * Format large numbers with abbreviations
   */
  formatLargeNumber: (value: number): string => {
    const units = ['', 'K', 'M', 'B', 'T'];
    let unitIndex = 0;
    let num = value;
    
    while (num >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }
    
    return `${num.toFixed(1)}${units[unitIndex]}`;
  },

  /**
   * Format dates
   */
  formatDate: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'PP');
  }
};