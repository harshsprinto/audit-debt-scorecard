
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserInfo } from '@/types/scorecard';

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserInfo;
  bookingUrl: string;
}

const BookConsultationModal: FC<BookConsultationModalProps> = ({
  isOpen,
  onClose,
  userInfo,
}) => {
  const handleBookingClick = () => {
    // Open booking URL with fixed UTM parameter
    window.open('https://sprinto.com/get-a-demo/?utm_source=audit+debt+scorecard', '_blank');
    
    // Show thank you page
    // In a real implementation, we might only show this after confirmation of booking
    // For demo purposes, we'll show it immediately
    onClose();
    
    // Simulate delay before redirecting to thank you page
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('booking-confirmed'));
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Schedule a Consultation</DialogTitle>
          <DialogDescription>
            Let our compliance experts help you tackle your audit debt challenges
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4">
            Hi {userInfo.fullName}, our team specializes in helping organizations like {userInfo.company} eliminate audit debt through automation.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <h4 className="font-medium text-gray-800 mb-2">In this 30-minute consultation, we'll:</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-sprinto-orange mr-2">•</span>
                <span>Discuss your specific compliance challenges</span>
              </li>
              <li className="flex items-start">
                <span className="text-sprinto-orange mr-2">•</span>
                <span>Share how other similar companies have solved audit debt</span>
              </li>
              <li className="flex items-start">
                <span className="text-sprinto-orange mr-2">•</span>
                <span>Provide a personalized action plan</span>
              </li>
              <li className="flex items-start">
                <span className="text-sprinto-orange mr-2">•</span>
                <span>Show how Sprinto can automate your compliance workflows</span>
              </li>
            </ul>
          </div>
          
          <p className="text-gray-600 text-sm">
            This consultation is completely free and comes with no obligation.
          </p>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          
          <Button 
            className="bg-sprinto-orange hover:bg-opacity-90 text-white"
            onClick={handleBookingClick}
          >
            Book My Consultation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookConsultationModal;
