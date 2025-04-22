
import { FormData, AuditDebtScore, RecommendationItem } from '@/types/scorecard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

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
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const checkForNewPage = (yPosition: number, neededSpace: number = 40) => {
      if (yPosition + neededSpace > pageHeight - 20) {
        doc.addPage();
        return 20;
      }
      return yPosition;
    };
    
    // Set Sprinto Orange color
    const sprintoOrange = [249, 115, 22]; // RGB
    
    // Title and header
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.setFontSize(24);
    doc.text('Sprinto Audit Debt Scorecard', pageWidth / 2, 20, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
    doc.setDrawColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 35, pageWidth - 20, 35);
    
    // Contact Information section
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('CONTACT INFORMATION', 20, 45);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // First row - Name and Company
    doc.text(`Name: ${userInfo.fullName}`, 20, 55);
    doc.text(`Company: ${userInfo.company}`, pageWidth/2, 55);
    
    // Second row - Designation (with text wrapping for long titles)
    const designation = `Designation: ${userInfo.designation}`;
    const designationWrapped = doc.splitTextToSize(designation, pageWidth/2 - 25);
    doc.text(designationWrapped, 20, 61);
    
    // Calculate vertical position for email based on designation height
    const emailY = 61 + (designationWrapped.length - 1) * 5;
    doc.text(`Email: ${userInfo.email}`, pageWidth/2, emailY > 61 ? emailY : 61);
    
    // Adjust y position based on height of contact info
    let yPos = Math.max(emailY, 61) + 14;
    
    // Audit Assessment Results section
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('AUDIT DEBT ASSESSMENT RESULTS', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Overall Risk Level: ${scoreResults.overallRiskLevel} (${scoreResults.overallScore}%)`, 20, yPos + 10);
    
    const sectionData = scoreResults.sections.map(section => [
      section.title, 
      section.riskLevel, 
      `${Math.round((section.score / section.maxScore) * 100)}%`
    ]);
    
    autoTable(doc, {
      head: [['Section', 'Risk Level', 'Score']],
      body: sectionData,
      startY: yPos + 15,
      theme: 'striped',
      headStyles: { fillColor: sprintoOrange },
      styles: { cellPadding: 2 },
      margin: { top: yPos + 15 }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Key Recommendations section
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('KEY RECOMMENDATIONS', 20, yPos);
    
    yPos += 10;
    
    // Show fewer recommendations to fit on one page
    const maxRecsToShow = 2;
    recommendations.slice(0, maxRecsToShow).forEach((rec, index) => {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. [${rec.priority}] ${rec.title}`, 20, yPos);
      
      // Wrap description text
      const description = doc.splitTextToSize(rec.description, pageWidth - 40);
      doc.setFontSize(8);
      doc.text(description, 25, yPos + 5);
      
      yPos += 10 + (description.length * 3);
    });
    
    // Business Impact section (2-column layout)
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('BUSINESS IMPACT', 20, yPos);
    
    const impactPoints = [
      '• Failed compliance audits',
      '• Lost business opportunities',
      '• Costly remediation efforts',
      '• Security vulnerabilities',
      '• Operational inefficiencies'
    ];
    
    // Create two columns for impact points
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    const midPoint = Math.ceil(impactPoints.length / 2);
    const leftColumn = impactPoints.slice(0, midPoint);
    const rightColumn = impactPoints.slice(midPoint);
    
    leftColumn.forEach((point, index) => {
      doc.text(point, 25, yPos + 15 + (index * 6));
    });
    
    rightColumn.forEach((point, index) => {
      doc.text(point, pageWidth/2, yPos + 15 + (index * 6));
    });
    
    // Calculate position for CTA
    yPos = yPos + 15 + (Math.max(leftColumn.length, rightColumn.length) * 6) + 10;
    
    // CTA section
    doc.setFillColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.roundedRect(20, yPos, pageWidth - 40, 30, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('TAKE ACTION NOW', pageWidth / 2, yPos + 12, { align: 'center' });
    
    doc.setFontSize(10);
    const ctaText = 'Schedule a demo to eliminate audit debt for your business';
    doc.text(ctaText, pageWidth / 2, yPos + 20, { align: 'center' });
    
    const ctaEmail = 'sales@sprinto.com';
    doc.text(ctaEmail, pageWidth / 2, yPos + 28, { align: 'center' });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`© ${new Date().getFullYear()} Sprinto. All rights reserved.`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
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
