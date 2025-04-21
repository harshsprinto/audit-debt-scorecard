
import { FormData, AuditDebtScore, RecommendationItem } from '@/types/scorecard';

// In a real application, this would use a PDF generation library
// like jsPDF, pdfmake, react-pdf, etc. to generate a real PDF.
// For this demo, we'll create a fake "PDF generator" that creates a blob
// that can be downloaded, but in reality it would be generated server-side
// or using a client-side PDF library.

export const generatePDF = (
  userInfo: FormData,
  scoreResults: AuditDebtScore, 
  recommendations: RecommendationItem[]
): Promise<Blob> => {
  return new Promise((resolve) => {
    // In a real implementation, this would generate an actual PDF.
    // For now, we'll just create a text representation
    
    const content = `
Sprinto Audit Debt Scorecard Report
===================================
Generated on: ${new Date().toLocaleDateString()}

CONTACT INFORMATION
------------------
Name: ${userInfo.fullName}
Company: ${userInfo.company}
Designation: ${userInfo.designation}
Email: ${userInfo.email}

AUDIT DEBT ASSESSMENT RESULTS
----------------------------
Overall Risk Level: ${scoreResults.overallRiskLevel} (${scoreResults.overallScore}%)

SECTION SCORES
-------------
${scoreResults.sections.map(section => 
  `${section.title}: ${section.riskLevel} (${Math.round((section.score / section.maxScore) * 100)}%)`
).join('\n')}

KEY RECOMMENDATIONS
-----------------
${recommendations.map(rec => 
  `[${rec.priority} Priority] ${rec.title}\n${rec.description}`
).join('\n\n')}

BUSINESS IMPACT
-------------
Unaddressed audit debt can lead to:
- Failed compliance audits
- Lost business opportunities
- Costly remediation efforts
- Security vulnerabilities
- Operational inefficiencies

NEXT STEPS
---------
Contact Sprinto to automate your compliance program and eliminate audit debt.
Visit: www.sprinto.com/get-a-demo

© ${new Date().getFullYear()} Sprinto. All rights reserved.
    `;
    
    // Create a blob that represents the "PDF"
    const blob = new Blob([content], { type: 'application/pdf' });
    resolve(blob);
  });
};

export const downloadPDF = async (
  userInfo: FormData,
  scoreResults: AuditDebtScore,
  recommendations: RecommendationItem[]
) => {
  try {
    const pdfBlob = await generatePDF(userInfo, scoreResults, recommendations);
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${userInfo.company.replace(/\s+/g, '_')}_Audit_Debt_Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF', error);
  }
};
