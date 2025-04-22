
import { FormData, AuditDebtScore, RecommendationItem } from '@/types/scorecard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

// Extend the jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export const generatePDF = (
  userInfo: FormData,
  scoreResults: AuditDebtScore, 
  recommendations: RecommendationItem[]
): Promise<Blob> => {
  return new Promise((resolve) => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Function to check if we need a new page
    const checkForNewPage = (yPosition: number, neededSpace: number = 40) => {
      if (yPosition + neededSpace > pageHeight - 20) {
        doc.addPage();
        return 20; // Reset Y position to top of new page with margin
      }
      return yPosition;
    };
    
    // Add Sprinto branding
    doc.setTextColor(155, 135, 245); // Primary Purple: #9b87f5
    doc.setFontSize(24);
    doc.text('Sprinto Audit Debt Scorecard', pageWidth / 2, 20, { align: 'center' });
    
    // Add date
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(155, 135, 245); // Primary Purple
    doc.setLineWidth(0.5);
    doc.line(20, 35, pageWidth - 20, 35);
    
    // Contact Information
    doc.setFontSize(14);
    doc.setTextColor(126, 105, 171); // Secondary Purple: #7E69AB
    doc.text('CONTACT INFORMATION', 20, 45);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Name: ${userInfo.fullName}`, 20, 55);
    doc.text(`Company: ${userInfo.company}`, 20, 61);
    doc.text(`Designation: ${userInfo.designation}`, 20, 67);
    doc.text(`Email: ${userInfo.email}`, 20, 73);
    
    // Assessment Results
    doc.setFontSize(14);
    doc.setTextColor(126, 105, 171); // Secondary Purple
    doc.text('AUDIT DEBT ASSESSMENT RESULTS', 20, 85);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Overall Risk Level: ${scoreResults.overallRiskLevel} (${scoreResults.overallScore}%)`, 20, 95);
    
    // Section Scores
    doc.setFontSize(14);
    doc.setTextColor(126, 105, 171); // Secondary Purple
    doc.text('SECTION SCORES', 20, 110);
    
    // Create a table for the section scores
    const sectionData = scoreResults.sections.map(section => [
      section.title, 
      section.riskLevel, 
      `${Math.round((section.score / section.maxScore) * 100)}%`
    ]);
    
    // Use the autoTable plugin correctly
    autoTable(doc, {
      head: [['Section', 'Risk Level', 'Score']],
      body: sectionData,
      startY: 115,
      theme: 'striped',
      headStyles: { fillColor: [155, 135, 245] } // Primary Purple
    });
    
    // Recommendations
    let yPos = doc.lastAutoTable.finalY + 15;
    yPos = checkForNewPage(yPos, 15);
    
    doc.setFontSize(14);
    doc.setTextColor(126, 105, 171); // Secondary Purple
    doc.text('KEY RECOMMENDATIONS', 20, yPos);
    
    yPos += 10;
    
    recommendations.forEach((rec, index) => {
      // Check if we need to add a new page before adding this recommendation
      yPos = checkForNewPage(yPos, 25); // Need at least 25 units for a recommendation
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. [${rec.priority} Priority] ${rec.title}`, 20, yPos);
      
      doc.setFontSize(9);
      doc.setTextColor(90, 90, 90);
      const description = doc.splitTextToSize(rec.description, pageWidth - 40);
      
      // Check if description will fit on current page
      yPos = checkForNewPage(yPos, description.length * 5 + 10);
      
      doc.text(description, 25, yPos + 6);
      
      yPos += 15 + (description.length * 5);
    });
    
    // Business Impact
    yPos = checkForNewPage(yPos, 60); // Check if we need a new page for business impact section
    
    doc.setFontSize(14);
    doc.setTextColor(126, 105, 171); // Secondary Purple
    doc.text('BUSINESS IMPACT', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Unaddressed audit debt can lead to:', 20, yPos);
    
    // Add impact points with enough spacing and page breaks if needed
    const impactPoints = [
      '• Failed compliance audits',
      '• Lost business opportunities',
      '• Costly remediation efforts',
      '• Security vulnerabilities',
      '• Operational inefficiencies'
    ];
    
    for (const point of impactPoints) {
      yPos += 6;
      yPos = checkForNewPage(yPos, 10);
      doc.text(point, 25, yPos);
    }
    
    // Add more prominent CTA with a clickable link
    yPos = checkForNewPage(yPos, 40); // Make sure we have enough space for CTA
    yPos += 15;
    
    // Create an eye-catching CTA box
    doc.setFillColor(249, 115, 22); // Bright Orange: #F97316
    doc.roundedRect(20, yPos, pageWidth - 40, 35, 3, 3, 'F');
    
    // Add CTA text
    doc.setTextColor(255, 255, 255); // White
    doc.setFontSize(14);
    doc.text('TAKE ACTION NOW', pageWidth / 2, yPos + 13, { align: 'center' });
    
    doc.setFontSize(10);
    const ctaText = 'Schedule a demo to discover how Sprinto can eliminate audit debt for your business';
    doc.text(ctaText, pageWidth / 2, yPos + 22, { align: 'center' });
    
    // Add clickable URL
    const ctaUrl = 'https://sprinto.com/get-a-demo/?utm_source=audit+debt+scorecard';
    doc.text(ctaUrl, pageWidth / 2, yPos + 30, { align: 'center' });
    
    // Make the entire box clickable
    doc.link(20, yPos, pageWidth - 40, 35, { url: ctaUrl });
    
    // Footer on the last page
    yPos = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`© ${new Date().getFullYear()} Sprinto. All rights reserved.`, pageWidth / 2, yPos, { align: 'center' });
    
    // Convert to blob and resolve promise
    const pdfBlob = doc.output('blob');
    resolve(pdfBlob);
  });
};

export const downloadPDF = async (
  userInfo: FormData,
  scoreResults: AuditDebtScore,
  recommendations: RecommendationItem[]
) => {
  try {
    const pdfBlob = await generatePDF(userInfo, scoreResults, recommendations);
    
    // Create a download link and trigger the download with .pdf extension
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${userInfo.company.replace(/\s+/g, '_')}_Audit_Debt_Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating report', error);
  }
};
