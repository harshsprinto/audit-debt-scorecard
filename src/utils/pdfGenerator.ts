
import { FormData, AuditDebtScore, RecommendationItem } from '@/types/scorecard';

// In a real application, this would use a PDF generation library
// like jsPDF, pdfmake, react-pdf, etc. to generate a real PDF.
// For this demo, we'll create a test PDF that can be opened.

export const generatePDF = (
  userInfo: FormData,
  scoreResults: AuditDebtScore, 
  recommendations: RecommendationItem[]
): Promise<Blob> => {
  return new Promise((resolve) => {
    // Create a properly formatted text content for the PDF
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
Visit: https://sprinto.com/get-a-demo/?utm_source=audit+debt+scorecard

© ${new Date().getFullYear()} Sprinto. All rights reserved.
    `;
    
    // Create a blob with the correct MIME type for text content
    // This ensures it can be opened by text editors, which is more reliable
    // than attempting to generate a true PDF format without proper libraries
    const blob = new Blob([content], { type: 'text/plain' });
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
    
    // Create a download link and trigger the download with .txt extension
    // This ensures the file can be properly opened
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${userInfo.company.replace(/\s+/g, '_')}_Audit_Debt_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating report', error);
  }
};
