
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInfo } from '@/types/scorecard';

interface ThankYouProps {
  userInfo: UserInfo;
  onDownloadReport: () => void;
}

const ThankYou: FC<ThankYouProps> = ({ userInfo, onDownloadReport }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-t-4 border-green-500">
        <CardHeader>
          <CardTitle className="text-2xl">Thank You for Booking a Consultation!</CardTitle>
          <CardDescription>
            We're looking forward to helping {userInfo.company} tackle its audit debt challenges.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-100">
            <h3 className="text-lg font-medium text-gray-800 mb-3">What Happens Next?</h3>
            
            <ol className="space-y-3 text-gray-700">
              <li className="flex">
                <span className="font-bold mr-2">1.</span>
                <span>You'll receive a calendar invitation to confirm your preferred time.</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">2.</span>
                <span>Our compliance expert will review your scorecard results before the call.</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">3.</span>
                <span>During the consultation, we'll discuss your specific challenges and provide personalized recommendations.</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">4.</span>
                <span>You'll receive a follow-up email with additional resources.</span>
              </li>
            </ol>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">In the meantime...</h3>
            
            <p className="text-gray-700 mb-4">
              Download your Audit Debt Scorecard report to share with your team or review at your convenience.
            </p>
            
            <Button 
              variant="outline" 
              onClick={onDownloadReport}
              className="w-full"
            >
              Download PDF Report
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Have questions before your consultation? Email us at <a href="mailto:sales@sprinto.com" className="text-sprinto-orange underline">sales@sprinto.com</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;
