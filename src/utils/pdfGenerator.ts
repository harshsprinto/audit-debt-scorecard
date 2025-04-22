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
    
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(24);
    doc.text('Sprinto Audit Debt Scorecard', pageWidth / 2, 20, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
    doc.setDrawColor(249, 115, 22);
    doc.setLineWidth(0.5);
    doc.line(20, 35, pageWidth - 20, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22);
    doc.text('CONTACT INFORMATION', 20, 45);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Name: ${userInfo.fullName}`, 20, 55);
    doc.text(`Company: ${userInfo.company}`, pageWidth/2, 55);
    doc.text(`Designation: ${userInfo.designation}`, 20, 61);
    doc.text(`Email: ${userInfo.email}`, pageWidth/2, 61);
    
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22);
    doc.text('AUDIT DEBT ASSESSMENT RESULTS', 20, 75);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Overall Risk Level: ${scoreResults.overallRiskLevel} (${scoreResults.overallScore}%)`, 20, 85);
    
    const sectionData = scoreResults.sections.map(section => [
      section.title, 
      section.riskLevel, 
      `${Math.round((section.score / section.maxScore) * 100)}%`
    ]);
    
    autoTable(doc, {
      head: [['Section', 'Risk Level', 'Score']],
      body: sectionData,
      startY: 90,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] },
      styles: { cellPadding: 2 },
      margin: { top: 90 }
    });
    
    let yPos = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22);
    doc.text('KEY RECOMMENDATIONS', 20, yPos);
    
    yPos += 10;
    
    recommendations.slice(0, 3).forEach((rec, index) => {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. [${rec.priority}] ${rec.title}`, 20, yPos);
      
      const description = doc.splitTextToSize(rec.description, pageWidth - 40);
      doc.setFontSize(8);
      doc.text(description, 25, yPos + 5);
      
      yPos += 15 + (description.length * 3);
    });
    
    yPos += 5;
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22);
    doc.text('BUSINESS IMPACT', 20, yPos);
    
    const impactPoints = [
      '• Failed compliance audits',
      '• Lost business opportunities',
      '• Costly remediation efforts',
      '• Security vulnerabilities',
      '• Operational inefficiencies'
    ];
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    impactPoints.forEach((point, index) => {
      const isRightColumn = index >= Math.ceil(impactPoints.length / 2);
      const xPos = isRightColumn ? pageWidth/2 : 25;
      const pointIndex = isRightColumn ? index - Math.ceil(impactPoints.length / 2) : index;
      doc.text(point, xPos, yPos + 15 + (pointIndex * 6));
    });
    
    yPos = yPos + 40;
    
    doc.setFillColor(249, 115, 22);
    doc.roundedRect(20, yPos, pageWidth - 40, 35, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('TAKE ACTION NOW', pageWidth / 2, yPos + 13, { align: 'center' });
    
    doc.setFontSize(10);
    const ctaText = 'Schedule a demo to discover how Sprinto can eliminate audit debt for your business';
    doc.text(ctaText, pageWidth / 2, yPos + 22, { align: 'center' });
    
    const ctaEmail = 'sales@sprinto.com';
    doc.text(ctaEmail, pageWidth / 2, yPos + 30, { align: 'center' });
    
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
