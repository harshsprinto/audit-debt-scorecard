
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecommendationItem } from '@/types/scorecard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface RecommendationsProps {
  recommendations: RecommendationItem[];
}

const Recommendations: FC<RecommendationsProps> = ({ recommendations }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to get icon based on recommendation title
  const getRecommendationIcon = (title: string): JSX.Element => {
    if (title.toLowerCase().includes('centraliz') || title.toLowerCase().includes('platform')) {
      return <div className="text-blue-500 bg-blue-100 p-2 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>;
    } else if (title.toLowerCase().includes('evidence') || title.toLowerCase().includes('automat')) {
      return <div className="text-purple-500 bg-purple-100 p-2 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg></div>;
    } else if (title.toLowerCase().includes('control') || title.toLowerCase().includes('review')) {
      return <div className="text-blue-500 bg-blue-100 p-2 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>;
    } else if (title.toLowerCase().includes('eliminat') || title.toLowerCase().includes('redundant') || title.toLowerCase().includes('secur')) {
      return <div className="text-orange-500 bg-orange-100 p-2 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l3 1m0 0l-3 9a5 5 0 0 0 6 0l3-9m-6 0l6-2m6 2l3-1m-3 1l-3 9a5 5 0 0 1-6 0m12-2v-2m0 0V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5m9-4v-2m0 0a2 2 0 0 0-2 2m2-2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2m-6-4v-2m0 0a2 2 0 0 0-2 2m2-2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2"></path></svg></div>;
    } else if (title.toLowerCase().includes('develop') || title.toLowerCase().includes('readiness')) {
      return <div className="text-blue-500 bg-blue-100 p-2 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>;
    } else if (title.toLowerCase().includes('streamline') || title.toLowerCase().includes('workflow')) {
      return <div className="text-green-500 bg-green-100 p-2 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></div>;
    } else {
      return <div className="text-blue-500 bg-blue-100 p-2 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9L13 2z"></path><polyline points="13 2 13 9 20 9"></polyline></svg></div>;
    }
  };

  // Helper function to get color for priority badge
  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <>
      {/* Recommendations Section - Adjusted width to 10% less than before */}
      <Card className="border-t-4 border-sprinto-blue max-w-[calc(3xl*1.08)] mx-auto mt-10">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center justify-between">
            Recommended Actions to Reduce Audit Debt
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "Collapse" : "Expand"} All
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* First recommendation - always visible */}
          {recommendations.length > 0 && (
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex">
                <div className="mr-4 mt-1">
                  {getRecommendationIcon(recommendations[0].title)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">{recommendations[0].title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(recommendations[0].priority)}`}>
                      {recommendations[0].priority} Priority
                    </span>
                  </div>
                  
                  <p className="text-gray-700">{recommendations[0].description}</p>
                  
                  <div className="mt-4 flex items-center text-xs text-gray-500">
                    <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Estimated time to implement: 2-4 weeks
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collapsible section for remaining recommendations */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4 mt-4">
            <CollapsibleContent className="space-y-4">
              {recommendations.slice(1).map((recommendation, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      {getRecommendationIcon(recommendation.title)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium">{recommendation.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(recommendation.priority)}`}>
                          {recommendation.priority} Priority
                        </span>
                      </div>
                      
                      <p className="text-gray-700">{recommendation.description}</p>
                      
                      <div className="mt-4 flex items-center text-xs text-gray-500">
                        <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Estimated time to implement: {(index % 3 === 0) ? '1-2 weeks' : (index % 3 === 1) ? '3-6 weeks' : '2-4 weeks'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <p className="text-sm text-gray-500 italic mt-2">
                These recommendations are based on your audit debt assessment. Implementing them will help reduce your overall audit debt.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
      
      {/* How Sprinto can help section - Adjusted width to 10% less than before */}
      <Card className="mt-10 max-w-[calc(3xl*1.08)] mx-auto">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">How Sprinto Can Help</h3>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-gray-700">
              Sprinto's compliance automation platform helps teams like yours eliminate audit debt by:
            </p>
            <ul className="mt-3 space-y-2 text-gray-700 list-disc pl-5">
              <li>Centralizing evidence collection and compliance workflows</li>
              <li>Automating controls monitoring and evidence gathering</li>
              <li>Providing real-time visibility into compliance status</li>
              <li>Streamlining audit preparation with purpose-built tools</li>
              <li>Offering expert guidance throughout your compliance journey</li>
            </ul>
            <p className="mt-4 text-gray-700">
              Schedule a personalized demo to see how Sprinto can help your organization reduce audit debt and achieve compliance with less effort.
            </p>
            
            {/* CTA Button - Full width */}
            <div className="mt-6">
              <Button className="bg-sprinto-orange hover:bg-opacity-90 text-white w-full py-6 text-base font-medium">
                Schedule a Free Demo to See How Sprinto Can Help You Eliminate Audit Debt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Recommendations;
