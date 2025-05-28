import { FormData, AuditDebtScore, RiskLevel, RecommendationItem } from '@/types/scorecard';

// Define the scoring logic
export const calculateScore = (formData: FormData): AuditDebtScore => {
  // Define section weights (must add up to 100)
  const sectionWeights = {
    complianceMaturity: 20,
    toolingAutomation: 20,
    securityOperations: 20,
    auditReadiness: 20,
    changeManagement: 20
  };

  // Calculate section scores
  const complianceMaturityScore = calculateComplianceMaturityScore(formData.sections.complianceMaturity);
  const toolingAutomationScore = calculateToolingAutomationScore(formData.sections.toolingAutomation, formData.sections);
  const securityOperationsScore = calculateSecurityOperationsScore(formData.sections.securityOperations, formData.sections);
  const auditReadinessScore = calculateAuditReadinessScore(formData.sections.auditReadiness);
  const changeManagementScore = calculateChangeManagementScore(formData.sections.changeManagement || {}, formData.sections);

  // Calculate weighted overall score (0-100)
  const overallScore = Math.round(
    (complianceMaturityScore.score / complianceMaturityScore.maxScore) * sectionWeights.complianceMaturity +
    (toolingAutomationScore.score / toolingAutomationScore.maxScore) * sectionWeights.toolingAutomation +
    (securityOperationsScore.score / securityOperationsScore.maxScore) * sectionWeights.securityOperations +
    (auditReadinessScore.score / auditReadinessScore.maxScore) * sectionWeights.auditReadiness +
    (changeManagementScore.score / changeManagementScore.maxScore) * sectionWeights.changeManagement
  );

  // Determine overall debt level
  let overallRiskLevel: RiskLevel;
  if (overallScore >= 75) {
    overallRiskLevel = 'Minimal';
  } else if (overallScore >= 50) {
    overallRiskLevel = 'Moderate';
  } else if (overallScore >= 25) {
    overallRiskLevel = 'Significant';
  } else {
    overallRiskLevel = 'High';
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
        title: 'Security Operations & Controls',
        ...securityOperationsScore,
        riskLevel: determineRiskLevel(securityOperationsScore.score, securityOperationsScore.maxScore)
      },
      {
        id: 'auditReadiness',
        title: 'Audit Readiness & Risk Management',
        ...auditReadinessScore,
        riskLevel: determineRiskLevel(auditReadinessScore.score, auditReadinessScore.maxScore)
      },
      {
        id: 'changeManagement',
        title: 'Change Management & Vendor Risk',
        ...changeManagementScore,
        riskLevel: determineRiskLevel(changeManagementScore.score, changeManagementScore.maxScore)
      }
    ]
  };
};

// Helper function to determine risk level from a score
const determineRiskLevel = (score: number, maxScore: number): RiskLevel => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 75) {
    return 'Minimal';
  } else if (percentage >= 50) {
    return 'Moderate';
  } else if (percentage >= 25) {
    return 'Significant';
  } else {
    return 'High';
  }
};

// Helper function to infer scores based on other responses
const inferScore = (sections: Record<string, any>, inferenceType: string): number => {
  switch (inferenceType) {
    case 'evidenceCollection':
      // Infer evidence collection from workflows automation
      const workflows = sections.toolingAutomation?.workflows;
      if (workflows === 'fullyAutomated') return 5;
      if (workflows === 'partiallyAutomated') return 3;
      if (workflows === 'manual') return 1;
      return 0;
    
    case 'incidentResponse':
      // Infer incident response from compliance team and security policies
      const complianceTeam = sections.complianceMaturity?.complianceTeam;
      const securityPolicies = sections.complianceMaturity?.securityPolicies;
      
      if ((complianceTeam === 'dedicatedTeam' || complianceTeam === 'dedicatedPerson') && 
          securityPolicies === 'documentedAndReviewed') return 5;
      if (complianceTeam === 'partTime' && securityPolicies === 'documented') return 3;
      if (securityPolicies === 'outdated') return 1;
      return 0;
    
    case 'controlMaturity':
      // Infer control maturity from compliance team and audit readiness
      const lastAudit = sections.auditReadiness?.lastAudit;
      const team = sections.complianceMaturity?.complianceTeam;
      
      if ((team === 'dedicatedTeam' || team === 'dedicatedPerson') && 
          (lastAudit === 'sixMonths' || lastAudit === 'oneYear')) return 5;
      if (team === 'partTime' && lastAudit === 'oneYear') return 3;
      if (lastAudit === 'twoYears') return 1;
      return 0;
    
    case 'riskAssessment':
      // Infer risk assessment from audit cadence
      const audit = sections.auditReadiness?.lastAudit;
      if (audit === 'sixMonths') return 5;
      if (audit === 'oneYear') return 3;
      if (audit === 'twoYears') return 2;
      return 0;
    
    case 'changeApproval':
      // Infer change approval from security policies
      const policies = sections.complianceMaturity?.securityPolicies;
      if (policies === 'documentedAndReviewed') return 5;
      if (policies === 'documented') return 3;
      if (policies === 'outdated') return 1;
      return 0;
    
    default:
      return 0;
  }
};

// Individual section scoring functions
const calculateComplianceMaturityScore = (section: Record<string, any>) => {
  let score = 0;
  const maxScore = 20; // Maximum possible points for this section
  
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
  
  // Question 4: How frequently are employees trained on compliance best practices?
  if (section.trainingFrequency) {
    switch (section.trainingFrequency) {
      case 'quarterly':
        score += 5;
        break;
      case 'biannual':
        score += 3;
        break;
      case 'annual':
        score += 2;
        break;
      case 'adhoc':
        score += 0;
        break;
    }
  }

  return { score, maxScore };
};

const calculateToolingAutomationScore = (section: Record<string, any>, allSections: Record<string, any>) => {
  let score = 0;
  const maxScore = 20; // Maximum possible points for this section
  
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
  
  // Question 2: What tools are in place for compliance management?
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
  
  // Question 3 (removed): Evidence collection - inferred from workflows
  score += inferScore(allSections, 'evidenceCollection');
  
  // Question 4: Are there automated alerts for compliance gaps or control failures?
  if (section.complianceGaps) {
    switch (section.complianceGaps) {
      case 'realtime':
        score += 5;
        break;
      case 'scheduled':
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

  return { score, maxScore };
};

const calculateSecurityOperationsScore = (section: Record<string, any>, allSections: Record<string, any>) => {
  let score = 0;
  const maxScore = 20; // Maximum possible points for this section
  
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
  
  // Question 3 (removed): Incident response - inferred from other sections
  score += inferScore(allSections, 'incidentResponse');
  
  // Question 4 (removed): Control maturity - inferred from other sections
  score += inferScore(allSections, 'controlMaturity');

  return { score, maxScore };
};

const calculateAuditReadinessScore = (section: Record<string, any>) => {
  let score = 0;
  const maxScore = 20; // Maximum possible points for this section
  
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
  
  // Question 4 (removed): Risk assessment - inferred from audit cadence
  score += inferScore({ auditReadiness: section }, 'riskAssessment');

  return { score, maxScore };
};

// Modified function for Change Management score
const calculateChangeManagementScore = (section: Record<string, any>, allSections: Record<string, any>) => {
  let score = 0;
  const maxScore = 20; // Maximum possible points for this section
  
  // Question 1 (removed): Change approval - inferred from security policies
  score += inferScore(allSections, 'changeApproval');
  
  // Question 2: Is there a clear protocol for tracking change-related risks?
  if (section.changeRiskTracking) {
    switch (section.changeRiskTracking) {
      case 'comprehensive':
        score += 5;
        break;
      case 'basic':
        score += 3;
        break;
      case 'minimal':
        score += 1;
        break;
      case 'none':
        score += 0;
        break;
    }
  }
  
  // Question 3: How are vendors assessed before onboarding?
  if (section.vendorAssessment) {
    switch (section.vendorAssessment) {
      case 'comprehensive':
        score += 5;
        break;
      case 'basic':
        score += 3;
        break;
      case 'minimal':
        score += 1;
        break;
      case 'none':
        score += 0;
        break;
    }
  }
  
  // Question 4: Is there an ongoing vendor risk monitoring process?
  if (section.vendorMonitoring) {
    switch (section.vendorMonitoring) {
      case 'automated':
        score += 5;
        break;
      case 'periodic':
        score += 3;
        break;
      case 'annual':
        score += 1;
        break;
      case 'none':
        score += 0;
        break;
    }
  }

  return { score, maxScore };
};

// Generate recommendations based on scores
export const generateRecommendations = (scoreResults: AuditDebtScore): RecommendationItem[] => {
  const recommendations: RecommendationItem[] = [];

  // Get sections with significant or high audit debt
  const lowScoringSections = scoreResults.sections.filter(
    section => section.riskLevel === 'High' || section.riskLevel === 'Significant'
  );

  // Add section-specific recommendations
  lowScoringSections.forEach(section => {
    switch (section.id) {
      case 'complianceMaturity':
        recommendations.push({
          title: 'Implement a Centralized Compliance Platform',
          description: 'Designate a compliance owner, develop a structured approach to compliance certifications, and implement regular training cycles to reduce Maturity Debt.',
          priority: section.riskLevel === 'High' ? 'High' : 'Medium'
        });
        recommendations.push({
          title: 'Streamline Compliance Workflows with Clear Ownership',
          description: 'Create or update security policies with regular review cycles and establish employee training programs that reflect current compliance requirements.',
          priority: section.riskLevel === 'High' ? 'High' : 'Medium'
        });
        break;
      
      case 'toolingAutomation':
        recommendations.push({
          title: 'Implement a Centralized Compliance Platform to Reduce Manual Audit Debt',
          description: 'Replace manual processes and spreadsheets with a dedicated compliance automation solution that centralizes evidence collection across frameworks.',
          priority: section.riskLevel === 'High' ? 'High' : 'Medium'
        });
        recommendations.push({
          title: 'Automate Evidence Collection to Cut Down Operational Audit Debt',
          description: 'Reduce manual effort and human error by implementing automated evidence collection and real-time alerts for control failures or compliance gaps.',
          priority: 'Medium'
        });
        break;
      
      case 'securityOperations':
        recommendations.push({
          title: 'Establish Regular Control Reviews to Reduce Controls Debt',
          description: 'Implement automated access reviews and continuous control monitoring with comprehensive documentation of controls that is regularly updated.',
          priority: section.riskLevel === 'High' ? 'High' : 'Medium'
        });
        recommendations.push({
          title: 'Eliminate Redundant Efforts in Security Operations',
          description: 'Develop detailed incident response documentation and conduct regular tabletop exercises to ensure effectiveness of your security operations.',
          priority: section.riskLevel === 'High' ? 'High' : 'Medium'
        });
        break;
      
      case 'auditReadiness':
        recommendations.push({
          title: 'Develop a Comprehensive Audit Readiness Program',
          description: 'Create a structured approach to prepare for audits more efficiently with regular risk assessments and streamlined evidence retrieval.',
          priority: section.riskLevel === 'High' ? 'High' : 'Medium'
        });
        recommendations.push({
          title: 'Streamline Compliance Workflows for Audit Efficiency',
          description: 'Map business risks to specific controls, establish a maintained risk register, and develop processes to identify and evaluate emerging risks.',
          priority: 'Medium'
        });
        break;
      
      case 'changeManagement':
        recommendations.push({
          title: 'Establish Formal Change Management Processes',
          description: 'Implement structured approval workflows for infrastructure and IT changes with clear risk tracking protocols and cross-team communication.',
          priority: section.riskLevel === 'High' ? 'High' : 'Medium'
        });
        recommendations.push({
          title: 'Automate Evidence Collection for Vendor Risk Management',
          description: 'Develop comprehensive vendor assessment procedures, implement ongoing monitoring, and regularly review contracts for compliance requirements.',
          priority: section.riskLevel === 'High' ? 'High' : 'Medium'
        });
        break;
    }
  });

  // Add general recommendations if needed
  if (scoreResults.overallRiskLevel === 'High' || scoreResults.overallRiskLevel === 'Significant') {
    recommendations.push({
      title: 'Eliminate Redundant Efforts with a Comprehensive Gap Assessment',
      description: 'Perform a thorough review of your compliance program to identify all gaps and develop a remediation plan with clear ownership and timelines.',
      priority: 'High'
    });
  }

  // If few recommendations generated, add some general ones
  if (recommendations.length < 3) {
    recommendations.push({
      title: 'Streamline Compliance Workflows with Clear Ownership',
      description: 'Define control ownership across teams, establish accountability metrics, and optimize your compliance processes to reduce manual effort.',
      priority: 'Medium'
    });
    
    recommendations.push({
      title: 'Automate Evidence Collection for Security Questionnaires',
      description: 'Implement a standardized process for managing incoming security questionnaires, ensuring accurate responses, and tracking completion.',
      priority: 'Low'
    });
  }

  return recommendations;
};

// Generate PDF report data
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
  
  if (formData.companySize) {
    queryParams.append('company_size', formData.companySize);
  }

  return `${baseUrl}?${queryParams.toString()}`;
};
