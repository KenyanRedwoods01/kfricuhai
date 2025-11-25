import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

/**
 * Advanced PDF Generation Service
 * Supports multiple formats: HTML to PDF, data to PDF, template-based PDF
 */
export class PDFGenerator {
  /**
   * Generate PDF from HTML content
   */
  static async generateFromHTML(
    elementId: string,
    filename: string = `document-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
    options?: {
      format?: 'a4' | 'letter' | 'legal';
      orientation?: 'portrait' | 'landscape';
      margin?: number;
      scale?: number;
    }
  ): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    const canvas = await html2canvas(element, {
      scale: options?.scale || 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options?.orientation || 'portrait',
      unit: 'mm',
      format: options?.format || 'a4',
    });

    const imgWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  }

  /**
   * Generate PDF from structured data
   */
  static generateFromData(
    data: any[],
    headers: string[],
    filename: string = `data-export-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
    options?: {
      title?: string;
      includePageNumbers?: boolean;
      includeTimestamp?: boolean;
      pageOrientation?: 'portrait' | 'landscape';
    }
  ): void {
    const pdf = new jsPDF({
      orientation: options?.pageOrientation || 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Add title if provided
    if (options?.title) {
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(options.title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
    }

    // Add timestamp if enabled
    if (options?.includeTimestamp) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Generated: ${format(new Date(), 'PPpp')}`,
        margin,
        pageHeight - 10
      );
    }

    // Table settings
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    
    const columnWidth = (pageWidth - 2 * margin) / headers.length;
    let xPosition = margin;

    // Draw headers
    headers.forEach((header) => {
      pdf.rect(xPosition, yPosition, columnWidth, 8);
      pdf.text(header, xPosition + 2, yPosition + 6);
      xPosition += columnWidth;
    });
    
    yPosition += 8;

    // Draw data rows
    pdf.setFont('helvetica', 'normal');
    data.forEach((row) => {
      xPosition = margin;
      
      headers.forEach((header) => {
        const cellValue = row[header.toLowerCase()] || row[header] || '';
        const text = String(cellValue).substring(0, 20); // Truncate long text
        pdf.rect(xPosition, yPosition, columnWidth, 6);
        pdf.text(text, xPosition + 2, yPosition + 4);
        xPosition += columnWidth;
      });
      
      yPosition += 6;
      
      // Add new page if needed
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
        xPosition = margin;
        
        // Re-draw headers on new page
        pdf.setFont('helvetica', 'bold');
        headers.forEach((header) => {
          pdf.rect(xPosition, yPosition, columnWidth, 8);
          pdf.text(header, xPosition + 2, yPosition + 6);
          xPosition += columnWidth;
        });
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
      }
    });

    // Add page numbers if enabled
    if (options?.includePageNumbers) {
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        );
      }
    }

    pdf.save(filename);
  }

  /**
   * Generate KPI Dashboard PDF
   */
  static async generateKPIDashboard(
    elementId: string,
    filename: string = `kpi-dashboard-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
    options?: {
      includeCharts?: boolean;
      includeSummary?: boolean;
      customTitle?: string;
    }
  ): Promise<void> {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      options?.customTitle || 'KPI Dashboard Report',
      pageWidth / 2,
      30,
      { align: 'center' }
    );

    // Date
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Generated on ${format(new Date(), 'PPpp')}`,
      pageWidth / 2,
      45,
      { align: 'center' }
    );

    // Summary section if enabled
    if (options?.includeSummary) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Executive Summary', 20, 65);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const summaryText = `This dashboard provides a comprehensive overview of key performance indicators across three phases:
• Phase 1: Quick Wins - Gross Profit Margin, Sales Growth, Inventory Turnover, CLV
• Phase 2: Analytics - Net Profit Margin, CAC, Retention Rate, Sales Forecasting  
• Phase 3: Intelligence - ROI, Churn Rate, Predictive Analytics, Customer Segmentation`;
      
      const splitText = pdf.splitTextToSize(summaryText, pageWidth - 40);
      pdf.text(splitText, 20, 80);
    }

    // Capture dashboard content
    const dashboardElement = document.getElementById(elementId);
    if (dashboardElement) {
      const canvas = await html2canvas(dashboardElement, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let yPosition = options?.includeSummary ? 120 : 70;
      
      if (yPosition + imgHeight > pageHeight - 20) {
        // Split across multiple pages if needed
        const availableHeight = pageHeight - yPosition - 20;
        const partialHeight = Math.min(availableHeight, imgHeight);
        
        pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, partialHeight);
        
        if (imgHeight > availableHeight) {
          pdf.addPage();
          yPosition = 20;
          const remainingHeight = imgHeight - availableHeight;
          
          // Continue with remaining content on new page
          pdf.addImage(
            imgData,
            'PNG',
            20,
            yPosition - (imgHeight - remainingHeight),
            imgWidth,
            remainingHeight
          );
        }
      } else {
        pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
      }
    }

    // Footer with page number
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(
        `MiniMax Agent Dashboard System`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    pdf.save(filename);
  }

  /**
   * Generate multi-page document with charts and tables
   */
  static async generateComplexDocument(
    sections: {
      title: string;
      type: 'chart' | 'table' | 'text' | 'image';
      content: any;
    }[],
    filename: string = `comprehensive-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`
  ): Promise<void> {
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Title page
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Business Intelligence Report', pageWidth / 2, 60, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Generated: ${format(new Date(), 'PPpp')}`,
      pageWidth / 2,
      80,
      { align: 'center' }
    );

    pdf.setFontSize(12);
    pdf.text(
      'Powered by MiniMax Agent Dashboard System',
      pageWidth / 2,
      100,
      { align: 'center' }
    );

    // Table of contents
    pdf.addPage();
    yPosition = margin;
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Table of Contents', margin, yPosition);
    yPosition += 20;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    sections.forEach((section, index) => {
      pdf.text(`${index + 1}. ${section.title}`, margin + 10, yPosition);
      yPosition += 10;
    });

    // Content sections
    for (const section of sections) {
      // Add new page for each section
      pdf.addPage();
      yPosition = margin;

      // Section title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(section.title, margin, yPosition);
      yPosition += 20;

      // Handle different content types
      switch (section.type) {
        case 'text':
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
          const textLines = pdf.splitTextToSize(String(section.content), pageWidth - 2 * margin);
          pdf.text(textLines, margin, yPosition);
          break;

        case 'table':
          // Handle table content
          if (section.content.headers && section.content.data) {
            this.drawTable(pdf, section.content.headers, section.content.data, margin, yPosition, pageWidth - 2 * margin);
          }
          break;

        case 'chart':
          // Handle chart content (assume it's an image or canvas element ID)
          if (typeof section.content === 'string') {
            const canvas = await html2canvas(document.getElementById(section.content) || document.body);
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - 2 * margin;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            if (yPosition + imgHeight > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            
            pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          }
          break;

        default:
          pdf.setFontSize(12);
          pdf.text('Content not supported in this format.', margin, yPosition);
      }
    }

    // Footer on each page
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    pdf.save(filename);
  }

  private static drawTable(
    pdf: jsPDF,
    headers: string[],
    data: any[],
    x: number,
    y: number,
    width: number
  ): void {
    const rowHeight = 8;
    const colWidth = width / headers.length;
    let currentY = y;

    // Headers
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(240, 240, 240);
    
    headers.forEach((header, index) => {
      pdf.rect(x + index * colWidth, currentY, colWidth, rowHeight, 'F');
      pdf.rect(x + index * colWidth, currentY, colWidth, rowHeight);
      pdf.text(header, x + index * colWidth + 2, currentY + 6);
    });
    
    currentY += rowHeight;

    // Data rows
    pdf.setFont('helvetica', 'normal');
    data.forEach((row) => {
      headers.forEach((header, index) => {
        const cellValue = String(row[header.toLowerCase()] || row[header] || '').substring(0, 15);
        pdf.rect(x + index * colWidth, currentY, colWidth, rowHeight);
        pdf.text(cellValue, x + index * colWidth + 2, currentY + 6);
      });
      currentY += rowHeight;
    });
  }
}

/**
 * Utility functions for PDF generation
 */
export const PDFUtils = {
  /**
   * Download PDF file
   */
  downloadPDF: (pdf: jsPDF, filename: string) => {
    pdf.save(filename);
  },

  /**
   * Get PDF as blob
   */
  getPDFBlob: (pdf: jsPDF): Blob => {
    return pdf.output('blob');
  },

  /**
   * Get PDF as base64 string
   */
  getPDFBase64: (pdf: jsPDF): string => {
    return pdf.output('datauristring');
  },

  /**
   * Add watermark to PDF
   */
  addWatermark: (pdf: jsPDF, watermarkText: string) => {
    const pageCount = pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setGState(new pdf.GState({ opacity: 0.3 }));
      pdf.setFontSize(50);
      pdf.setTextColor(200, 200, 200);
      pdf.text(
        watermarkText,
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() / 2,
        { align: 'center', angle: 45 }
      );
    }
  }
};