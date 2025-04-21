
import { FormData, AuditDebtScore, RiskLevel, RecommendationItem } from '@/types/scorecard';

// Define the scoring logic
export const calculateScore = (formData: FormData): AuditDebtScore => {
  // Define section weights (must add up to 100)
  const sectionWeights = {
    complianceMaturity: 25,
    toolingAutomation: 25,
    securityOperations: 25,
    auditReadiness: 25
  };

  // Calculate section scores
  const complianceMaturityScore = calculateComplianceMaturityScore(formData.sections.complianceMaturity);
  const toolingAutomationScore = calculateToolingAutomationScore(formData.sections.toolingAutomation);
  const securityOperationsScore = calculateSecurityOperationsScore(formData.sections.securityOperations);
  const auditReadinessScore = calculateAuditReadinessScore(formData.sections.auditReadiness);

  // Calculate weighted overall score (0-100)
  const overallScore = Math.round(
    (complianceMaturityScore.score / complianceMaturityScore.maxScore) * sectionWeights.complianceMaturity +
    (toolingAutomationScore.score / toolingAutomationScore.maxScore) * sectionWeights.toolingAutomation +
    (securityOperationsScore.score / securityOperationsScore.maxScore) * sectionWeights.securityOperations +
    (auditReadinessScore.score / auditReadinessScore.maxScore) * sectionWeights.auditReadiness
  );

  // Determine overall risk level
  let overallRiskLevel: RiskLevel;
  if (overallScore >= 75) {
    overallRiskLevel = 'Low';
  } else if (overallScore >= 50) {
    overallRiskLevel = 'Moderate';
  } else if (overallScore >= 25) {
    overallRiskLevel = 'High';
  } else {
    overallRiskLevel = 'Critical';
  }

  return {
    overallScore,
    overallRiskLevel,
    sections: [
      {
        id: 'complianceMaturity',
        title: 'Compliance Program Maturity',
        ...complianceMaturityScore,
        riskLevel: determineRiskLevel(complianceMaturityScore.score, complianceMaturityScore.maxScore)
      },
      {
        id: 'toolingAutomation',
        title: 'Tooling & Automation',
        ...toolingAutomationScore,
        riskLevel: determineRiskLevel(toolingAutomationScore.score, toolingAutomationScore.maxScore)
      },
      {
        id: 'securityOperations',
        title: 'Security Operations',
        ...securityOperationsScore,
        riskLevel: determineRiskLevel(securityOperationsScore.score, securityOperationsScore.maxScore)
      },
      {
        id: 'auditReadiness',
        title: 'Audit Readiness',
        ...auditReadinessScore,
        riskLevel: determineRiskLevel(auditReadinessScore.score, auditReadinessScore.maxScore)
      }
    ]
  };
};

// Helper function to determine risk level from a score
const determineRiskLevel = (score: number, maxScore: number): RiskLevel => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 75) {
    return 'Low';
  } else if (percentage >= 50) {
    return 'Moderate';
  } else if (percentage >= 25) {
    return 'High';
  } else {
    return 'Critical';
  }
};

// Individual section scoring functions
const calculateComplianceMaturityScore = (section: Record<string, any>) => {
  let score = 0;
  const maxScore = 15; // Maximum possible points for this section
  
  // Question 1: Do you currently have any compliance certifications?
  if (section.certifications) {
    switch (section.certifications) {
      case 'multiple':
        score += 5;
        break;
      case 'one':
        score += 3;
        break;
      case 'inProgress':
        score += 2;
        break;
      case 'none':
        score += 0;
        break;
    }
  }
  
  // Question 2: Do you have a designated compliance owner/team?
  if (section.complianceTeam) {
    switch (section.complianceTeam) {
      case 'dedicatedTeam':
        score += 5;
        break;
      case 'dedicatedPerson':
        score += 4;
        break;
      case 'partTime':
        score += 2;
        break;
      case 'none':
        score += 0;
        break;
    }
  }
  
  // Question 3: Are your security policies documented and regularly reviewed?
  if (section.securityPolicies) {
    switch (section.securityPolicies) {
      case 'documentedAndReviewed':
        score += 5;
        break;
      case 'documented':
        score += 3;
        break;
      case 'outdated':
        score += 1;
        break;
      case 'none':
        score += 0;
        break;
    }
  }

  return { score, maxScore };
};

const calculateToolingAutomationScore = (section: Record<string, any>) => {
  let score = 0;
  const maxScore = 15; // Maximum possible points for this section
  
  // Question 1: Are compliance workflows automated or done manually?
  if (section.workflows) {
    switch (section.workflows) {
      case 'fullyAutomated':
        score += 5;
        break;
      case 'partiallyAutomated':
        score += 3;
        break;
      case 'manual':
        score += 1;
        break;
      case 'none':
        score += 0;
        break;
    }
  }
  
  // Question 2: Do you use a compliance management tool today?
  if (section.complianceTool) {
    switch (section.complianceTool) {
      case 'dedicated':
        score += 5;
        break;
      case 'general':
        score += 3;
        break;
      case 'spreadsheets':
        score += 1;
        break;
      case 'none':
        score += 0;
        break;
    }
  }
  
  // Question 3: How is audit evidence collected today?
  if (section.evidenceCollection) {
    switch (section.evidenceCollection) {
      case 'automated':
        score += 5;
        break;
      case 'centralizedManual':
        score += 3;
        break;
      case 'adhoc':
        score += 1;
        break;
      case 'none':
        score += 0;
        break;
    }
  }

  return { score, maxScore };
};

const calculateSecurityOperationsScore = (section: Record<string, any>) => {
  let score = 0;
  const maxScore = 15; // Maximum possible points for this section
  
  // Question 1: How frequently do you conduct access reviews?
  if (section.accessReviews) {
    switch (section.accessReviews) {
      case 'automated':
        score += 5;
        break;
      case 'quarterly':
        score += 4;
        break;
      case 'annually':
        score += 2;
        break;
      case 'never':
        score += 0;
        break;
    }
  }
  
  // Question 2: Are you monitoring for control violations in real-time?
  if (section.controlMonitoring) {
    switch (section.controlMonitoring) {
      case 'automated':
        score += 5;
        break;
      case 'regular':
        score += 3;
        break;
      case 'adhoc':
        score += 1;
        break;
      case 'none':
        score += 0;
        break;
    }
  }
  
  // Question 3: Do you have incident response documentation?
  if (section.incidentResponse) {
    switch (section.incidentResponse) {
      case 'documentedAndTested':
        score += 5;
        break;
      case 'documented':
        score += 3;
        break;
      case 'informal':
        score += 1;
        break;
      case 'none':
        score += 0;
        break;
    }
  }

  return { score, maxScore };
};

const calculateAuditReadinessScore = (section: Record<string, any>) => {
  let score = 0;
  const maxScore = 15; // Maximum possible points for this section
  
  // Question 1: When was your last formal audit?
  if (section.lastAudit) {
    switch (section.lastAudit) {
      case 'sixMonths':
        score += 5;
        break;
      case 'oneYear':
        score += 4;
        break;
      case 'twoYears':
        score += 2;
        break;
      case 'never':
        score += 0;
        break;
    }
  }
  
  // Question 2: How long does it take you to prepare for audits?
  if (section.auditPrep) {
    switch (section.auditPrep) {
      case 'lessThanMonth':
        score += 5;
        break;
      case 'oneToThreeMonths':
        score += 3;
        break;
      case 'threeToSixMonths':
        score += 1;
        break;
      case 'moreThanSixMonths':
        score += 0;
        break;
    }
  }
  
  // Question 3: Have you ever lost a deal or delayed funding due to compliance gaps?
  if (section.dealImpact) {
    switch (section.dealImpact) {
      case 'never':
        score += 5;
        break;
      case 'rarely':
        score += 3;
        break;
      case 'occasionally':
        score += 1;
        break;
      case 'frequently':
        score += 0;
        break;
    }
  }

  return { score, maxScore };
};

// Generate recommendations based on scores
export const generateRecommendations = (scoreResults: AuditDebtScore): RecommendationItem[] => {
  const recommendations: RecommendationItem[] = [];

  // Get low-scoring sections (with Risk Level of High or Critical)
  const lowScoringSections = scoreResults.sections.filter(
    section => section.riskLevel === 'High' || section.riskLevel === 'Critical'
  );

  // Add section-specific recommendations
  lowScoringSections.forEach(section => {
    switch (section.id) {
      case 'complianceMaturity':
        recommendations.push({
          title: 'Establish a Formal Compliance Program',
          description: 'Designate a compliance owner and develop a structured approach to compliance certifications.',
          priority: section.riskLevel === 'Critical' ? 'High' : 'Medium'
        });
        recommendations.push({
          title: 'Document and Standardize Security Policies',
          description: 'Create or update security policies with regular review cycles to ensure they remain current.',
          priority: section.riskLevel === 'Critical' ? 'High' : 'Medium'
        });
        break;
      
      case 'toolingAutomation':
        recommendations.push({
          title: 'Implement a Compliance Management Platform',
          description: 'Replace manual processes and spreadsheets with a dedicated compliance automation solution.',
          priority: section.riskLevel === 'Critical' ? 'High' : 'Medium'
        });
        recommendations.push({
          title: 'Automate Evidence Collection',
          description: 'Reduce manual effort and human error by automating the collection of compliance evidence.',
          priority: 'Medium'
        });
        break;
      
      case 'securityOperations':
        recommendations.push({
          title: 'Establish Regular Access Reviews',
          description: 'Implement quarterly or more frequent access reviews to maintain proper access control.',
          priority: section.riskLevel === 'Critical' ? 'High' : 'Medium'
        });
        recommendations.push({
          title: 'Implement Real-time Control Monitoring',
          description: 'Set up continuous monitoring of security controls to detect violations promptly.',
          priority: section.riskLevel === 'Critical' ? 'High' : 'Medium'
        });
        break;
      
      case 'auditReadiness':
        recommendations.push({
          title: 'Develop an Audit Readiness Program',
          description: 'Create a structured approach to prepare for audits more efficiently and with less disruption.',
          priority: section.riskLevel === 'Critical' ? 'High' : 'Medium'
        });
        recommendations.push({
          title: 'Centralize Compliance Evidence',
          description: 'Store all compliance evidence in a central repository for quick access during audits.',
          priority: 'Medium'
        });
        break;
    }
  });

  // Add general recommendations if needed
  if (scoreResults.overallRiskLevel === 'High' || scoreResults.overallRiskLevel === 'Critical') {
    recommendations.push({
      title: 'Conduct a Comprehensive Compliance Gap Assessment',
      description: 'Perform a thorough review of your compliance program to identify all gaps and develop a remediation plan.',
      priority: 'High'
    });
  }

  // If few recommendations generated, add some general ones
  if (recommendations.length < 3) {
    recommendations.push({
      title: 'Streamline Compliance Workflows',
      description: 'Optimize your compliance processes to reduce manual effort and improve efficiency.',
      priority: 'Medium'
    });
    
    recommendations.push({
      title: 'Enhance Compliance Training',
      description: 'Ensure all team members understand their responsibilities in maintaining compliance.',
      priority: 'Low'
    });
  }

  return recommendations;
};

// Generate PDF report data (placeholder for actual PDF generation)
export const generateReportData = (formData: FormData, scoreResults: AuditDebtScore, recommendations: RecommendationItem[]) => {
  // This would be expanded to actually generate PDF in a real implementation
  return {
    userInfo: formData,
    scoreResults,
    recommendations,
    generatedAt: new Date().toISOString()
  };
};

// Generate a booking URL
export const generateBookingUrl = (formData: FormData, score: number) => {
  const baseUrl = 'https://sprinto.com/get-a-demo';
  const queryParams = new URLSearchParams({
    name: formData.fullName,
    email: formData.email,
    company: formData.company,
    source: 'audit_debt_scorecard',
    score: score.toString()
  });

  return `${baseUrl}?${queryParams.toString()}`;
};
