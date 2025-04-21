
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface SectionScore {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  riskLevel: RiskLevel;
}

export interface AuditDebtScore {
  overallScore: number;
  overallRiskLevel: RiskLevel;
  sections: SectionScore[];
}

export interface UserInfo {
  fullName: string;
  email: string;
  company: string;
  designation: string;
}

export interface FormData extends UserInfo {
  sections: {
    [key: string]: {
      [key: string]: string | string[] | number;
    };
  };
}

export interface RecommendationItem {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}
