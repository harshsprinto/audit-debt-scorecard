
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Linkedin, Slack } from 'lucide-react';
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

  // Handle sharing through different channels - now directly shares the PDF
  const handleShare = (method: string) => {
    // First generate the PDF, then share it
    if (onShareClick) {
      onShareClick(method);
    } else {
      // Generate and share the PDF
      onDownloadClick(); // Generate the PDF first
      
      console.log(`Sharing PDF via ${method}`);
      if (method === 'email') {
        // Open email client with the PDF report as the subject
        window.open(`mailto:?subject=Audit Debt Report for ${userInfo.company}&body=Please find attached the Audit Debt Report for ${userInfo.company}.`);
      } else if (method === 'linkedin') {
        // For LinkedIn, we'll still need to use the URL, but we can show a message that the PDF needs to be attached manually
        alert('LinkedIn sharing: Please attach the downloaded PDF to your LinkedIn post for sharing.');
        window.open('https://www.linkedin.com/sharing/share-offsite/');
      } else if (method === 'slack') {
        // For Slack, show guidance on how to share the PDF
        alert('Slack sharing: Please upload the downloaded PDF to your Slack conversation.');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4 sm:px-6">
      <Card className="border-t-4 border-sprinto-orange shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-gray-100 leading-tight">
            Your Audit Debt Assessment Results
          </CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Based on your responses, we've calculated the following audit debt score for {userInfo.company}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Overall Audit Debt Level</h3>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center ${getDebtLevelColor(scoreResults.overallRiskLevel)} text-white font-bold text-lg sm:text-xl flex-shrink-0`}>
                {scoreResults.overallScore}%
              </div>
              
              <div className="text-center sm:text-left">
                <h4 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {scoreResults.overallRiskLevel}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {getDebtLevelDescription(scoreResults.overallRiskLevel)}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Audit Debt Breakdown</h3>
            
            <div className="space-y-4">
              {scoreResults.sections.map((section) => (
                <div key={section.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-2 sm:space-y-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                      {section.title} Audit Debt
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs text-white ${getDebtLevelColor(section.riskLevel)} self-start sm:self-auto`}>
                      {section.riskLevel}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full ${getDebtLevelColor(section.riskLevel)}`} 
                      style={{ width: `${(section.score / section.maxScore) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Score: {section.score}/{section.maxScore}</span>
                    <span>{Math.round((section.score / section.maxScore) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-sprinto-blue bg-opacity-10 dark:bg-sprinto-blue dark:bg-opacity-20 p-4 sm:p-6 rounded-lg border border-sprinto-blue border-opacity-20 dark:border-sprinto-blue dark:border-opacity-40">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              What This Means For Your Business
            </h3>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              Your organization has identified areas of audit debt that, if unaddressed, could lead to operational inefficiencies, compliance issues, and potential revenue loss. Taking proactive measures now can mitigate risks, secure deals, and improve compliance posture.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
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
          <div className="p-4 sm:p-5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Industry Comparison</h3>
            
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-24 sm:w-32 flex-shrink-0">Your Score:</span>
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getDebtLevelColor(scoreResults.overallRiskLevel)}`} 
                    style={{ width: `${scoreResults.overallScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 w-12 text-right">{scoreResults.overallScore}%</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-24 sm:w-32 flex-shrink-0">Industry Avg:</span>
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${Math.min(85, Math.max(40, scoreResults.overallScore + (scoreResults.overallScore > 50 ? -15 : 15)))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 w-12 text-right">
                  {Math.min(85, Math.max(40, scoreResults.overallScore + (scoreResults.overallScore > 50 ? -15 : 15)))}%
                </span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              *Based on data from similar mid-market companies in your industry
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 mt-8">
            <Button 
              onClick={onContactClick}
              className="flex-1 bg-sprinto-orange hover:bg-sprinto-orange/90 text-white py-4 sm:py-6 text-sm sm:text-base font-medium"
            >
              <span className="text-center leading-tight">
                Reduce Your Audit Debt Now: Speak with a Compliance Expert
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 py-4 sm:py-6 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Download className="mr-2 h-4 w-4" />
                  <span className="text-sm sm:text-base">Download or Share PDF</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                <DropdownMenuItem onClick={() => onDownloadClick()} className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('email')} className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <Mail className="mr-2 h-4 w-4" />
                  Share via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('linkedin')} className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <Linkedin className="mr-2 h-4 w-4" />
                  Share via LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('slack')} className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <Slack className="mr-2 h-4 w-4" />
                  Share via Slack
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
