
// Define the question types
export type QuestionType = 'select' | 'radio' | 'slider' | 'multiselect';

// Define the question interface
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

// Define question sections and questions for the scorecard
export const scorecardSections = [
  {
    id: 'complianceMaturity',
    title: 'Compliance Program Maturity',
    description: 'Let\'s assess how mature your compliance program is today.',
    questions: [
      {
        id: 'certifications',
        text: 'Do you currently have any compliance certifications (SOC 2, ISO 27001, etc.)?',
        type: 'select' as QuestionType,
        options: [
          { value: 'multiple', label: 'Yes, multiple certifications' },
          { value: 'one', label: 'Yes, one certification' },
          { value: 'inProgress', label: 'No, but we\'re in the process of obtaining one' },
          { value: 'none', label: 'No certifications' }
        ]
      },
      {
        id: 'complianceTeam',
        text: 'Do you have a designated compliance owner/team?',
        type: 'select' as QuestionType,
        options: [
          { value: 'dedicatedTeam', label: 'Yes, a dedicated compliance team' },
          { value: 'dedicatedPerson', label: 'Yes, a dedicated compliance person' },
          { value: 'partTime', label: 'Yes, but it\'s a part-time responsibility' },
          { value: 'none', label: 'No designated owner' }
        ]
      },
      {
        id: 'securityPolicies',
        text: 'Are your security policies documented and regularly reviewed?',
        type: 'select' as QuestionType,
        options: [
          { value: 'documentedAndReviewed', label: 'Yes, documented and regularly reviewed' },
          { value: 'documented', label: 'Yes, documented but not regularly reviewed' },
          { value: 'outdated', label: 'Yes, but they\'re mostly outdated' },
          { value: 'none', label: 'No formal documentation' }
        ]
      },
      {
        id: 'trainingFrequency',
        text: 'How frequently are employees trained on compliance best practices?',
        type: 'select' as QuestionType,
        options: [
          { value: 'quarterly', label: 'Quarterly or more frequent' },
          { value: 'biannual', label: 'Biannually' },
          { value: 'annual', label: 'Annually' },
          { value: 'adhoc', label: 'Ad-hoc or never' }
        ]
      }
    ]
  },
  {
    id: 'toolingAutomation',
    title: 'Tooling & Automation',
    description: 'Let\'s understand how automated your compliance processes are.',
    questions: [
      {
        id: 'workflows',
        text: 'Are compliance workflows automated or done manually?',
        type: 'select' as QuestionType,
        options: [
          { value: 'fullyAutomated', label: 'Fully automated' },
          { value: 'partiallyAutomated', label: 'Partially automated' },
          { value: 'manual', label: 'Completely manual' },
          { value: 'none', label: 'We don\'t have established workflows' }
        ]
      },
      {
        id: 'complianceTool',
        text: 'What tools are in place for compliance management?',
        type: 'select' as QuestionType,
        options: [
          { value: 'dedicated', label: 'Dedicated compliance platform with automation' },
          { value: 'general', label: 'General tools (Jira, ticketing systems, etc.)' },
          { value: 'spreadsheets', label: 'Spreadsheets and documents' },
          { value: 'none', label: 'No tools in place' }
        ]
      },
      {
        id: 'evidenceCollection',
        text: 'How automated is evidence collection across frameworks?',
        type: 'select' as QuestionType,
        options: [
          { value: 'automated', label: 'Automatically collected with real-time updates' },
          { value: 'centralizedManual', label: 'Manually collected but centrally stored' },
          { value: 'adhoc', label: 'Ad-hoc collection when needed' },
          { value: 'none', label: 'We don\'t formally collect evidence' }
        ]
      },
      {
        id: 'complianceGaps',
        text: 'Are there automated alerts for compliance gaps or control failures?',
        type: 'select' as QuestionType,
        options: [
          { value: 'realtime', label: 'Yes, real-time automated alerts' },
          { value: 'scheduled', label: 'Yes, scheduled automated checks' },
          { value: 'manual', label: 'No, gaps are identified manually' },
          { value: 'none', label: 'No monitoring for compliance gaps' }
        ]
      }
    ]
  },
  {
    id: 'securityOperations',
    title: 'Security Operations & Controls',
    description: 'Let\'s evaluate your security operations and control maturity.',
    questions: [
      {
        id: 'accessReviews',
        text: 'How frequently do you conduct access reviews?',
        type: 'select' as QuestionType,
        options: [
          { value: 'automated', label: 'Continuously through automation' },
          { value: 'quarterly', label: 'Quarterly or more frequently' },
          { value: 'annually', label: 'Annually or semi-annually' },
          { value: 'never', label: 'Never or very rarely' }
        ]
      },
      {
        id: 'controlMonitoring',
        text: 'Are you monitoring for control violations in real-time?',
        type: 'select' as QuestionType,
        options: [
          { value: 'automated', label: 'Yes, with automated alerting' },
          { value: 'regular', label: 'Yes, with regular manual checks' },
          { value: 'adhoc', label: 'Only ad-hoc monitoring' },
          { value: 'none', label: 'No monitoring in place' }
        ]
      },
      {
        id: 'incidentResponse',
        text: 'Do you have incident response documentation?',
        type: 'select' as QuestionType,
        options: [
          { value: 'documentedAndTested', label: 'Yes, documented and regularly tested' },
          { value: 'documented', label: 'Yes, documented but not regularly tested' },
          { value: 'informal', label: 'Informal processes only' },
          { value: 'none', label: 'No incident response plan' }
        ]
      },
      {
        id: 'controlMaturity',
        text: 'How are your controls documented and reviewed?',
        type: 'select' as QuestionType,
        options: [
          { value: 'comprehensiveReviewed', label: 'Comprehensively documented and regularly reviewed' },
          { value: 'documented', label: 'Documented but not regularly reviewed' },
          { value: 'partial', label: 'Partially documented' },
          { value: 'none', label: 'Minimal or no documentation' }
        ]
      }
    ]
  },
  {
    id: 'auditReadiness',
    title: 'Audit Readiness & Risk Management',
    description: 'Let\'s assess how prepared you are for compliance audits and how you manage risks.',
    questions: [
      {
        id: 'lastAudit',
        text: 'When was your last formal audit?',
        type: 'select' as QuestionType,
        options: [
          { value: 'sixMonths', label: 'Within the last 6 months' },
          { value: 'oneYear', label: 'Within the last year' },
          { value: 'twoYears', label: 'More than a year ago' },
          { value: 'never', label: 'Never had a formal audit' }
        ]
      },
      {
        id: 'auditPrep',
        text: 'How long does it take you to prepare for audits?',
        type: 'select' as QuestionType,
        options: [
          { value: 'lessThanMonth', label: 'Less than a month' },
          { value: 'oneToThreeMonths', label: '1-3 months' },
          { value: 'threeToSixMonths', label: '3-6 months' },
          { value: 'moreThanSixMonths', label: 'More than 6 months' }
        ]
      },
      {
        id: 'dealImpact',
        text: 'Have you ever lost a deal or delayed funding due to compliance gaps?',
        type: 'select' as QuestionType,
        options: [
          { value: 'never', label: 'Never' },
          { value: 'rarely', label: 'Rarely' },
          { value: 'occasionally', label: 'Occasionally' },
          { value: 'frequently', label: 'Frequently' }
        ]
      },
      {
        id: 'riskAssessment',
        text: 'How often are risk assessments conducted?',
        type: 'select' as QuestionType,
        options: [
          { value: 'quarterly', label: 'Quarterly or more frequently' },
          { value: 'biannual', label: 'Biannually' },
          { value: 'annual', label: 'Annually' },
          { value: 'adhoc', label: 'Ad-hoc or never' }
        ]
      }
    ]
  },
  {
    id: 'changeManagement',
    title: 'Change Management & Vendor Risk',
    description: 'Let\'s evaluate your change management processes and vendor risk management.',
    questions: [
      {
        id: 'changeApproval',
        text: 'How are infrastructure or IT changes approved and documented?',
        type: 'select' as QuestionType,
        options: [
          { value: 'formalAutomated', label: 'Formal process with automated workflow' },
          { value: 'formalManual', label: 'Formal process with manual documentation' },
          { value: 'informal', label: 'Informal process' },
          { value: 'none', label: 'No formal approval process' }
        ]
      },
      {
        id: 'changeRiskTracking',
        text: 'Is there a clear protocol for tracking change-related risks?',
        type: 'select' as QuestionType,
        options: [
          { value: 'comprehensive', label: 'Yes, comprehensive risk tracking' },
          { value: 'basic', label: 'Yes, basic risk tracking' },
          { value: 'minimal', label: 'Minimal risk tracking' },
          { value: 'none', label: 'No risk tracking' }
        ]
      },
      {
        id: 'vendorAssessment',
        text: 'How are vendors assessed before onboarding?',
        type: 'select' as QuestionType,
        options: [
          { value: 'comprehensive', label: 'Comprehensive security and compliance review' },
          { value: 'basic', label: 'Basic security review' },
          { value: 'minimal', label: 'Minimal or questionnaire-only review' },
          { value: 'none', label: 'No formal assessment' }
        ]
      },
      {
        id: 'vendorMonitoring',
        text: 'Is there an ongoing vendor risk monitoring process?',
        type: 'select' as QuestionType,
        options: [
          { value: 'automated', label: 'Automated continuous monitoring' },
          { value: 'periodic', label: 'Periodic reassessments' },
          { value: 'annual', label: 'Annual review only' },
          { value: 'none', label: 'No ongoing monitoring' }
        ]
      }
    ]
  }
];
