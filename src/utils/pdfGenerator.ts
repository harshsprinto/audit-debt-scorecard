
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
    
    // Set Sprinto Orange color - fixed as tuple of exactly 3 elements
    const sprintoOrange: [number, number, number] = [249, 115, 22]; // RGB
    
    // Title and header
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.setFontSize(20);
    
    // Use text wrapping for the title to avoid overlap
    const title = 'Sprinto Audit Debt Scorecard';
    const titleLines = doc.splitTextToSize(title, pageWidth - 40);
    doc.text(titleLines, pageWidth / 2, 20, { align: 'center' });
    
    // Adjust position based on title height
    let headerY = 20 + (titleLines.length * 7);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, headerY, { align: 'center' });
    
    doc.setDrawColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.setLineWidth(0.5);
    doc.line(20, headerY + 5, pageWidth - 20, headerY + 5);
    
    // Contact Information section - using 2-column layout to save space
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('CONTACT INFORMATION', 20, headerY + 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    
    // Using 2 column layout for all contact info
    doc.text(`Name: ${userInfo.fullName}`, 20, headerY + 22);
    doc.text(`Company: ${userInfo.company}`, pageWidth/2, headerY + 22);
    
    // Format designation with text wrapping
    const designation = `Designation: ${userInfo.designation}`;
    const designationWrapped = doc.splitTextToSize(designation, pageWidth/2 - 25);
    doc.text(designationWrapped, 20, headerY + 27);
    
    // Place email on the right side
    doc.text(`Email: ${userInfo.email}`, pageWidth/2, headerY + 27);
    
    // Adjust y position based on height of contact info
    let yPos = headerY + 35;
    
    // Audit Assessment Results section - more compact
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('AUDIT DEBT ASSESSMENT RESULTS', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Overall Risk Level: ${scoreResults.overallRiskLevel} (${scoreResults.overallScore}%)`, 20, yPos + 7);
    
    // Create section data for the table
    const sectionData = scoreResults.sections.map(section => [
      section.title, 
      section.riskLevel, 
      `${Math.round((section.score / section.maxScore) * 100)}%`
    ]);
    
    // Compact table for results
    autoTable(doc, {
      head: [['Section', 'Risk Level', 'Score']],
      body: sectionData,
      startY: yPos + 12,
      theme: 'striped',
      headStyles: { fillColor: sprintoOrange as [number, number, number] },
      styles: { cellPadding: 2, fontSize: 8 },
      margin: { top: yPos + 12 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 45 },
        2: { cellWidth: 25 }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 8;
    
    // Key Recommendations section - more compact
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('KEY RECOMMENDATIONS', 20, yPos);
    
    yPos += 7;
    
    // Show limited recommendations with more compact formatting
    const maxRecsToShow = 3; // Show up to 3 recommendations to fit on one page
    recommendations.slice(0, maxRecsToShow).forEach((rec, index) => {
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. [${rec.priority}] ${rec.title}`, 20, yPos);
      
      // Wrap description text with smaller font
      doc.setFontSize(8);
      const description = doc.splitTextToSize(rec.description, pageWidth - 40);
      doc.text(description, 25, yPos + 4);
      
      yPos += 5 + (description.length * 3);
    });
    
    // Insights Section - Add detailed insights based on scores
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('INSIGHTS & NEXT STEPS', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    
    // Only show insights for low and high score sections
    const criticalSection = scoreResults.sections.find(s => s.riskLevel === 'Critical');
    const bestSection = scoreResults.sections.find(s => s.riskLevel === 'Low');
    
    yPos += 7;
    
    if (criticalSection) {
      const criticalInsight = `Critical Focus Area: ${criticalSection.title} requires immediate attention. Organizations with similar profiles typically see a 30-40% reduction in audit preparation time after addressing this area.`;
      const criticalLines = doc.splitTextToSize(criticalInsight, pageWidth - 40);
      doc.text(criticalLines, 20, yPos);
      yPos += criticalLines.length * 3 + 2;
    }
    
    if (bestSection) {
      const strengthInsight = `Strength: Your ${bestSection.title} practices are strong. Continue to maintain excellence in this area while focusing resources on higher-risk domains.`;
      const strengthLines = doc.splitTextToSize(strengthInsight, pageWidth - 40);
      doc.text(strengthLines, 20, yPos);
      yPos += strengthLines.length * 3 + 2;
    }
    
    // Add industry benchmark if space permits
    const benchmarkText = `Industry Benchmark: Mid-market companies similar to yours typically achieve a ${scoreResults.overallScore > 50 ? 'lower' : 'higher'} overall score of ${Math.min(85, Math.max(40, scoreResults.overallScore + (scoreResults.overallScore > 50 ? -15 : 15)))}%. The most successful organizations invest in compliance automation to reduce manual efforts by up to 70%.`;
    const benchmarkLines = doc.splitTextToSize(benchmarkText, pageWidth - 40);
    doc.text(benchmarkLines, 20, yPos);
    
    yPos += benchmarkLines.length * 3 + 5;
    
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
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    
    const midPoint = Math.ceil(impactPoints.length / 2);
    const leftColumn = impactPoints.slice(0, midPoint);
    const rightColumn = impactPoints.slice(midPoint);
    
    yPos += 7;
    
    leftColumn.forEach((point, index) => {
      doc.text(point, 25, yPos + (index * 4));
    });
    
    rightColumn.forEach((point, index) => {
      doc.text(point, pageWidth/2, yPos + (index * 4));
    });
    
    // Calculate position for CTA
    yPos = yPos + (Math.max(leftColumn.length, rightColumn.length) * 4) + 8;
    
    // CTA section
    doc.setFillColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.roundedRect(20, yPos, pageWidth - 40, 25, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('TAKE ACTION NOW', pageWidth / 2, yPos + 10, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text('Schedule a demo to eliminate audit debt for your business', pageWidth / 2, yPos + 17, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('sales@sprinto.com', pageWidth / 2, yPos + 24, { align: 'center' });
    
    // Footer
    doc.setFontSize(7);
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
