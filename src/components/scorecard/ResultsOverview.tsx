
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuditDebtScore, UserInfo } from '@/types/scorecard';

interface ResultsOverviewProps {
  userInfo: UserInfo;
  scoreResults: AuditDebtScore;
  onContactClick: () => void;
  onDownloadClick: () => void;
}

const ResultsOverview: FC<ResultsOverviewProps> = ({
  userInfo,
  scoreResults,
  onContactClick,
  onDownloadClick
}) => {
  // Helper function to get color based on risk level
  const getRiskLevelColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'High':
        return 'bg-orange-500';
      case 'Critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Helper function to get text for risk level
  const getRiskLevelDescription = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'Low':
        return 'Your organization has minimal audit debt. Continue with your current practices.';
      case 'Moderate':
        return 'Your organization has some audit debt that should be addressed in the coming months.';
      case 'High':
        return 'Your organization has significant audit debt that requires immediate attention.';
      case 'Critical':
        return 'Your organization has critical audit debt that poses serious risks to your business.';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="border-t-4 border-sprinto-orange">
        <CardHeader>
          <CardTitle className="text-2xl">Your Audit Debt Assessment Results</CardTitle>
          <CardDescription>
            Based on your responses, we've calculated the following audit debt risk score for {userInfo.company}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Risk Level</h3>
            
            <div className="flex items-center space-x-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${getRiskLevelColor(scoreResults.overallRiskLevel)} text-white font-bold text-lg`}>
                {scoreResults.overallScore}%
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-gray-800">{scoreResults.overallRiskLevel}</h4>
                <p className="text-gray-600">{getRiskLevelDescription(scoreResults.overallRiskLevel)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Score Breakdown</h3>
            
            <div className="space-y-4">
              {scoreResults.sections.map((section) => (
                <div key={section.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{section.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getRiskLevelColor(section.riskLevel)}`}>
                      {section.riskLevel}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getRiskLevelColor(section.riskLevel)}`} 
                      style={{ width: `${(section.score / section.maxScore) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Score: {section.score}/{section.maxScore}</span>
                    <span>{Math.round((section.score / section.maxScore) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-sprinto-blue bg-opacity-10 p-6 rounded-lg border border-sprinto-blue border-opacity-20">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What This Means For Your Business</h3>
            
            <p className="text-gray-700 mb-4">
              {scoreResults.overallRiskLevel === 'Low' && 
                "Your organization is in good standing with minimal audit debt. Continue to maintain your current compliance practices."}
              {scoreResults.overallRiskLevel === 'Moderate' && 
                "Your organization has some audit debt that could become problematic over time. Consider addressing these issues in the next few months."}
              {scoreResults.overallRiskLevel === 'High' && 
                "Your organization has significant audit debt that may already be impacting your business operations. Immediate attention is recommended."}
              {scoreResults.overallRiskLevel === 'Critical' && 
                "Your organization has critical audit debt that poses serious risks to your business continuity, customer trust, and ability to close deals."}
            </p>
            
            <p className="text-gray-700">
              Audit debt can lead to failed audits, lost deals, operational inefficiencies, and heightened security risks. Addressing these issues now can save significant time and resources in the future.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Button 
              onClick={onContactClick}
              className="flex-1 bg-sprinto-orange hover:bg-opacity-90 text-white py-6"
            >
              Need help fixing this? Talk to our experts
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onDownloadClick}
              className="flex-1"
            >
              Download PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsOverview;
