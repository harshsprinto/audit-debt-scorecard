
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, AlertTriangle, Clock } from 'lucide-react';
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

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Recommended Actions</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((item, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${getPriorityColor(item.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getPriorityIcon(item.priority)}
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
          <h3 className="font-medium text-gray-800 mb-2">How Sprinto Can Help</h3>
          
          <p className="text-gray-600 mb-3">
            Sprinto is a compliance automation platform that helps organizations eliminate audit debt through:
          </p>
          
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Centralizing evidence collection and automating compliance workflows</li>
            <li>Continuously monitoring controls to prevent compliance drift</li>
            <li>Simplifying policy management and documentation</li>
            <li>Providing expert guidance throughout the compliance journey</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Recommendations;
