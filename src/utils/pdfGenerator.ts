
import { FormData, AuditDebtScore, RecommendationItem } from '@/types/scorecard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

// Extend the jsPDF type to include autoTable with proper return type
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
    
    // Add Sprinto branding
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add title with Sprinto purple color
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
    
    doc.autoTable({
      startY: 115,
      head: [['Section', 'Risk Level', 'Score']],
      body: sectionData,
      theme: 'striped',
      headStyles: { fillColor: [155, 135, 245] } // Primary Purple
    });
    
    // Recommendations
    doc.setFontSize(14);
    doc.setTextColor(126, 105, 171); // Secondary Purple
    doc.text('KEY RECOMMENDATIONS', 20, doc.lastAutoTable.finalY + 15);
    
    let yPos = doc.lastAutoTable.finalY + 25;
    recommendations.forEach((rec, index) => {
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. [${rec.priority} Priority] ${rec.title}`, 20, yPos);
      
      doc.setFontSize(9);
      doc.setTextColor(90, 90, 90);
      const description = doc.splitTextToSize(rec.description, pageWidth - 40);
      doc.text(description, 25, yPos + 6);
      
      yPos += 15 + (description.length * 5);
    });
    
    // Business Impact
    yPos += 5;
    doc.setFontSize(14);
    doc.setTextColor(126, 105, 171); // Secondary Purple
    doc.text('BUSINESS IMPACT', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Unaddressed audit debt can lead to:', 20, yPos);
    yPos += 6;
    doc.text('• Failed compliance audits', 25, yPos);
    yPos += 6;
    doc.text('• Lost business opportunities', 25, yPos);
    yPos += 6;
    doc.text('• Costly remediation efforts', 25, yPos);
    yPos += 6;
    doc.text('• Security vulnerabilities', 25, yPos);
    yPos += 6;
    doc.text('• Operational inefficiencies', 25, yPos);
    
    // CTA
    yPos += 15;
    doc.setFillColor(155, 135, 245); // Primary Purple
    doc.rect(20, yPos, pageWidth - 40, 30, 'F');
    
    doc.setTextColor(255, 255, 255); // White
    doc.setFontSize(12);
    doc.text('NEXT STEPS', pageWidth / 2, yPos + 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Contact Sprinto to automate your compliance program and eliminate audit debt.', pageWidth / 2, yPos + 20, { align: 'center' });
    doc.text('Visit: https://sprinto.com/get-a-demo/?utm_source=audit+debt+scorecard', pageWidth / 2, yPos + 25, { align: 'center' });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`© ${new Date().getFullYear()} Sprinto. All rights reserved.`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    
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
