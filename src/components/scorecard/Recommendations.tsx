
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, AlertTriangle, Clock, Settings, Database, Trash2, TrendingUp } from 'lucide-react';
import { RecommendationItem } from '@/types/scorecard';

interface RecommendationsProps {
  recommendations: RecommendationItem[];
}

const Recommendations: FC<RecommendationsProps> = ({ recommendations }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Low':
        return <BadgeCheck className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-red-200 bg-red-50';
      case 'Medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'Low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getRecommendationIcon = (title: string) => {
    if (title.toLowerCase().includes('centralized') || title.toLowerCase().includes('platform')) {
      return <Settings className="h-6 w-6 text-blue-500" />;
    } else if (title.toLowerCase().includes('automate') || title.toLowerCase().includes('evidence')) {
      return <Database className="h-6 w-6 text-purple-500" />;
    } else if (title.toLowerCase().includes('eliminate') || title.toLowerCase().includes('redundant')) {
      return <Trash2 className="h-6 w-6 text-orange-500" />;
    } else if (title.toLowerCase().includes('streamline') || title.toLowerCase().includes('workflow')) {
      return <TrendingUp className="h-6 w-6 text-green-500" />;
    } else {
      return <Settings className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Recommended Actions to Reduce Audit Debt</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((item, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${getPriorityColor(item.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex flex-col items-center">
                  {getRecommendationIcon(item.title)}
                  <div className="mt-2">
                    {getPriorityIcon(item.priority)}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800">
                    {item.title}
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority} Priority
                    </span>
                  </h4>
                  
                  <p className="text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2">How Sprinto Eliminates Audit Debt:</h3>
          
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <Database className="h-5 w-5 text-blue-500 mr-3" />
              <span>Automates evidence collection to reduce compliance effort by up to 90%</span>
            </li>
            <li className="flex items-center">
              <Settings className="h-5 w-5 text-blue-500 mr-3" />
              <span>Centralizes compliance tasks, reducing oversight gaps</span>
            </li>
            <li className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-3" />
              <span>Monitors compliance continuously, preventing policy drift</span>
            </li>
            <li className="flex items-center">
              <Trash2 className="h-5 w-5 text-blue-500 mr-3" />
              <span>Eliminates redundant efforts and streamlines compliance workflows</span>
            </li>
          </ul>
          
          <div className="mt-6">
            <button
              onClick={() => window.open('https://sprinto.com/get-a-demo/?utm_source=audit+debt+scorecard', '_blank')}
              className="w-full py-2 bg-sprinto-orange hover:bg-opacity-90 text-white rounded-md transition-colors duration-200"
            >
              Take Control of Your Audit Debt: Book a Demo with Us Now
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Recommendations;
