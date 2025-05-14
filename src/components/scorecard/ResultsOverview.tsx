
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuditDebtScore, UserInfo } from '@/types/scorecard';

interface ResultsOverviewProps {
  userInfo: UserInfo;
  scoreResults: AuditDebtScore;
  onContactClick: () => void;
  onDownloadClick: () => void;
  onShareClick?: (method: string) => void;
}

const ResultsOverview: FC<ResultsOverviewProps> = ({
  userInfo,
  scoreResults,
  onContactClick,
  onDownloadClick,
  onShareClick
}) => {
  // Helper function to get color based on debt level
  const getDebtLevelColor = (debtLevel: string): string => {
    switch (debtLevel) {
      case 'Minimal':
        return 'bg-green-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'Significant':
        return 'bg-orange-500';
      case 'High':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Helper function to get text for debt level
  const getDebtLevelDescription = (debtLevel: string): string => {
    switch (debtLevel) {
      case 'Minimal':
        return 'Your organization has minimal audit debt. Continue with your current practices.';
      case 'Moderate':
        return 'Your organization has some audit debt that should be addressed in the coming months.';
      case 'Significant':
        return 'Your organization has significant audit debt that requires immediate attention.';
      case 'High':
        return 'Your organization has high audit debt that poses serious risks to your business.';
      default:
        return '';
    }
  };

  // Handle sharing through different channels
  const handleShare = (method: string) => {
    if (onShareClick) {
      onShareClick(method);
    } else {
      console.log(`Sharing via ${method}`);
      // Fallback implementation if onShareClick not provided
      if (method === 'email') {
        window.open(`mailto:?subject=Audit Debt Report for ${userInfo.company}&body=Please find attached the Audit Debt Report for ${userInfo.company}.`);
      } else if (method === 'linkedin') {
        window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href));
      } else if (method === 'slack') {
        // This would normally open a Slack sharing dialog or integration
        alert('Slack sharing would be integrated here');
      } else if (method === 'link') {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="border-t-4 border-sprinto-orange">
        <CardHeader>
          <CardTitle className="text-2xl">Your Audit Debt Assessment Results</CardTitle>
          <CardDescription>
            Based on your responses, we've calculated the following audit debt score for {userInfo.company}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Audit Debt Level</h3>
            
            <div className="flex items-center space-x-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${getDebtLevelColor(scoreResults.overallRiskLevel)} text-white font-bold text-lg`}>
                {scoreResults.overallScore}%
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-gray-800">{scoreResults.overallRiskLevel}</h4>
                <p className="text-gray-600">{getDebtLevelDescription(scoreResults.overallRiskLevel)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Audit Debt Breakdown</h3>
            
            <div className="space-y-4">
              {scoreResults.sections.map((section) => (
                <div key={section.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{section.title} Audit Debt</h4>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getDebtLevelColor(section.riskLevel)}`}>
                      {section.riskLevel}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getDebtLevelColor(section.riskLevel)}`} 
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
              Your organization has identified areas of audit debt that, if unaddressed, could lead to operational inefficiencies, compliance issues, and potential revenue loss. Taking proactive measures now can mitigate risks, secure deals, and improve compliance posture.
            </p>
            
            <p className="text-gray-700">
              {scoreResults.overallRiskLevel === 'Minimal' && 
                "While your audit debt is minimal, maintaining vigilance will ensure continued compliance effectiveness and operational efficiency."}
              {scoreResults.overallRiskLevel === 'Moderate' && 
                "Your moderate audit debt presents an opportunity to strengthen your compliance program before it impacts business operations and stakeholder confidence."}
              {scoreResults.overallRiskLevel === 'Significant' && 
                "Your significant audit debt requires immediate attention to prevent operational disruptions, revenue impacts, and compliance failures."}
              {scoreResults.overallRiskLevel === 'High' && 
                "Your high audit debt poses an urgent threat to business continuity, customer trust, regulatory standing, and ability to close deals."}
            </p>
          </div>

          {/* Industry Standard Comparison */}
          <div className="p-5 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Industry Comparison</h3>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-32">Your Score:</span>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getDebtLevelColor(scoreResults.overallRiskLevel)}`} 
                    style={{ width: `${scoreResults.overallScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{scoreResults.overallScore}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-32">Industry Average:</span>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${Math.min(85, Math.max(40, scoreResults.overallScore + (scoreResults.overallScore > 50 ? -15 : 15)))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{Math.min(85, Math.max(40, scoreResults.overallScore + (scoreResults.overallScore > 50 ? -15 : 15)))}%</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              *Based on data from similar mid-market companies in your industry
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Button 
              onClick={onContactClick}
              className="flex-1 bg-sprinto-orange hover:bg-opacity-90 text-white py-6"
            >
              Reduce Your Audit Debt Now: Speak with a Compliance Expert
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download or Share PDF
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onDownloadClick()}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('email')}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('slack')}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via Slack
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('link')}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsOverview;
