
import { FormData, AuditDebtScore, RecommendationItem } from '@/types/scorecard';
import jsPDF from 'jspdf';
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
    
    // Set Sprinto Orange color - defined as a tuple of exactly 3 elements
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
    
    // Using 2 column layout for all contact info with increased vertical spacing
    doc.text(`Name: ${userInfo.fullName}`, 20, headerY + 25);
    doc.text(`Company: ${userInfo.company}`, pageWidth/2, headerY + 25);
    
    // Format designation with text wrapping and increased vertical spacing
    const designation = `Designation: ${userInfo.designation}`;
    const designationWrapped = doc.splitTextToSize(designation, pageWidth/2 - 25);
    doc.text(designationWrapped, 20, headerY + 35);
    
    // Place email on the right side with proper spacing
    doc.text(`Email: ${userInfo.email}`, pageWidth/2, headerY + 35);
    
    // Add company size if available
    if (userInfo.companySize) {
      doc.text(`Company Size: ${userInfo.companySize}`, 20, headerY + 45);
    }
    
    // Adjust y position based on height of contact info
    let yPos = headerY + (userInfo.companySize ? 55 : 45);
    
    // Audit Assessment Results section - more compact but with better spacing
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('AUDIT DEBT ASSESSMENT RESULTS', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Overall Audit Debt Level: ${scoreResults.overallRiskLevel} (${scoreResults.overallScore}%)`, 20, yPos + 10);
    
    // Create section data for the table with "Audit Debt" appended to section titles
    const sectionData = scoreResults.sections.map(section => [
      `${section.title} Audit Debt`, 
      section.riskLevel, 
      `${Math.round((section.score / section.maxScore) * 100)}%`
    ]);
    
    // Compact table for results with better spacing
    autoTable(doc, {
      head: [['Section', 'Debt Level', 'Score']],
      body: sectionData,
      startY: yPos + 15,
      theme: 'striped',
      headStyles: { fillColor: sprintoOrange },
      styles: { cellPadding: 3, fontSize: 8 },
      margin: { top: yPos + 15 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 45 },
        2: { cellWidth: 25 }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Assessment Overview section - updated to reflect streamlined assessment
    yPos = checkForNewPage(yPos, 60);
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('ASSESSMENT OVERVIEW', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    yPos += 10;
    
    const assessmentText = "This streamlined assessment evaluates your organization's audit debt across 5 critical areas through 15 focused questions. Our scoring algorithm incorporates both direct responses and intelligent inferences to provide a comprehensive view of your compliance maturity.";
    const assessmentLines = doc.splitTextToSize(assessmentText, pageWidth - 40);
    doc.text(assessmentLines, 20, yPos);
    yPos += assessmentLines.length * 4 + 8;
    
    // Areas Assessed section
    doc.setFontSize(10);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('AREAS ASSESSED:', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    yPos += 8;
    
    const assessedAreas = [
      '• Compliance Program Maturity - Foundation and governance',
      '• Tooling & Automation - Process efficiency and technology adoption',
      '• Security Operations & Controls - Risk management and monitoring',
      '• Audit Readiness - Preparation and business impact',
      '• Change Management & Vendor Risk - Risk tracking and vendor oversight'
    ];
    
    assessedAreas.forEach((area, index) => {
      doc.text(area, 25, yPos + (index * 5));
    });
    yPos += assessedAreas.length * 5 + 10;
    
    // Key Recommendations section - with better spacing
    yPos = checkForNewPage(yPos, 60);
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('KEY RECOMMENDATIONS TO REDUCE AUDIT DEBT', 20, yPos);
    
    yPos += 10;
    
    // Show recommendations with more space between items
    recommendations.slice(0, 3).forEach((rec, index) => {
      // Check if we need a new page for each recommendation
      yPos = checkForNewPage(yPos, 30); // Increased needed space
      
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. [${rec.priority}] ${rec.title}`, 20, yPos);
      
      // Wrap description text with smaller font and more spacing
      doc.setFontSize(8);
      const description = doc.splitTextToSize(rec.description, pageWidth - 40);
      doc.text(description, 25, yPos + 5);
      
      yPos += 10 + (description.length * 4); // Increased spacing between recommendations
    });
    
    // Insights Section - Add detailed insights based on scores
    yPos = checkForNewPage(yPos, 50);
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('INSIGHTS & NEXT STEPS', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    
    yPos += 10;
    
    // Updated content for What This Means for Your Business
    const businessImpactText = "Your organization's audit debt assessment reveals specific areas where proactive investment can reduce compliance risks, improve operational efficiency, and strengthen your market position. The streamlined evaluation focuses on the most impactful factors for business success.";
    const businessImpactLines = doc.splitTextToSize(businessImpactText, pageWidth - 40);
    doc.text(businessImpactLines, 20, yPos);
    yPos += businessImpactLines.length * 4 + 8;
    
    // Only show insights for problem areas and strengths with better spacing
    const criticalSection = scoreResults.sections.find(s => s.riskLevel === 'High' || s.riskLevel === 'Significant');
    const bestSection = scoreResults.sections.find(s => s.riskLevel === 'Minimal');
    
    if (criticalSection) {
      yPos = checkForNewPage(yPos, 25);
      const criticalInsight = `Priority Focus: ${criticalSection.title} Audit Debt requires immediate attention. Organizations addressing this area typically see 30-40% improvement in compliance efficiency within 6 months.`;
      const criticalLines = doc.splitTextToSize(criticalInsight, pageWidth - 40);
      doc.text(criticalLines, 20, yPos);
      yPos += criticalLines.length * 4 + 8;
    }
    
    if (bestSection) {
      yPos = checkForNewPage(yPos, 25);
      const strengthInsight = `Strength Area: Your ${bestSection.title} shows minimal audit debt. This foundation can support improvements in other areas while maintaining operational excellence.`;
      const strengthLines = doc.splitTextToSize(strengthInsight, pageWidth - 40);
      doc.text(strengthLines, 20, yPos);
      yPos += strengthLines.length * 4 + 8;
    }
    
    // Add updated industry benchmark with proper spacing
    yPos = checkForNewPage(yPos, 25);
    const benchmarkText = `Methodology Note: This assessment combines direct responses with intelligent inferences based on compliance best practices. Organizations with similar profiles typically achieve ${scoreResults.overallScore > 60 ? 'similar' : 'higher'} scores after implementing targeted improvements.`;
    const benchmarkLines = doc.splitTextToSize(benchmarkText, pageWidth - 40);
    doc.text(benchmarkLines, 20, yPos);
    
    yPos += benchmarkLines.length * 4 + 10;
    
    // Business Impact section with better spacing
    yPos = checkForNewPage(yPos, 50);
    doc.setFontSize(12);
    doc.setTextColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.text('BUSINESS IMPACT OF AUDIT DEBT', 20, yPos);
    
    const impactPoints = [
      '• Failed compliance audits and regulatory penalties',
      '• Lost business opportunities and delayed funding',
      '• Costly last-minute remediation efforts',
      '• Security vulnerabilities and operational risks',
      '• Reduced stakeholder confidence and market position'
    ];
    
    // Create two columns for impact points with better spacing
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    
    yPos += 10;
    
    // Spaced out impact points in one column
    impactPoints.forEach((point, index) => {
      doc.text(point, 25, yPos + (index * 6));
    });
    
    // Calculate position for CTA
    yPos = yPos + (impactPoints.length * 6) + 15;
    
    // CTA section - check for new page first
    yPos = checkForNewPage(yPos, 35);
    doc.setFillColor(sprintoOrange[0], sprintoOrange[1], sprintoOrange[2]);
    doc.roundedRect(20, yPos, pageWidth - 40, 30, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('TAKE CONTROL OF YOUR AUDIT DEBT', pageWidth / 2, yPos + 12, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text('Schedule a demo to reduce audit debt and strengthen your compliance program', pageWidth / 2, yPos + 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('sales@sprinto.com', pageWidth / 2, yPos + 28, { align: 'center' });
    
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
