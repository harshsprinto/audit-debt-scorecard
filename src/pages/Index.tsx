import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import LeadForm from '@/components/scorecard/LeadForm';
import QuestionSection from '@/components/scorecard/QuestionSection';
import ResultsOverview from '@/components/scorecard/ResultsOverview';
import Recommendations from '@/components/scorecard/Recommendations';
import BookConsultationModal from '@/components/scorecard/BookConsultationModal';
import ThankYou from '@/components/scorecard/ThankYou';
import { scorecardSections, Question } from '@/data/questions';
import { FormData, UserInfo, AuditDebtScore, RecommendationItem } from '@/types/scorecard';
import { calculateScore, generateRecommendations, generateBookingUrl } from '@/utils/scorecardUtils';
import { downloadPDF } from '@/utils/pdfGenerator';

// Define the steps of the scorecard flow
enum Step {
  LEAD_FORM,
  SECTION_1,
  SECTION_2,
  SECTION_3,
  SECTION_4,
  RESULTS,
  THANK_YOU,
}
const Index = () => {
  // State for the current step
  const [currentStep, setCurrentStep] = useState<Step>(Step.LEAD_FORM);

  // State for user info and form data
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    designation: '',
    sections: {
      complianceMaturity: {},
      toolingAutomation: {},
      securityOperations: {},
      auditReadiness: {}
    }
  });

  // State for results
  const [scoreResults, setScoreResults] = useState<AuditDebtScore | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  // State for the consultation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingUrl, setBookingUrl] = useState('');

  // Handle lead form submission
  const handleLeadFormSubmit = (userInfo: UserInfo) => {
    setFormData(prev => ({
      ...prev,
      ...userInfo
    }));
    setCurrentStep(Step.SECTION_1);
  };

  // Handle question answers
  const handleQuestionAnswer = (sectionId: string, questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: {
          ...prev.sections[sectionId],
          [questionId]: value
        }
      }
    }));
  };

  // Handle next section
  const handleNextSection = () => {
    if (currentStep < Step.RESULTS) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate final score and show results
      const results = calculateScore(formData);
      setScoreResults(results);
      setRecommendations(generateRecommendations(results));
      setBookingUrl(generateBookingUrl(formData, results.overallScore));
    }
  };

  // Handle back button
  const handleBackSection = () => {
    if (currentStep > Step.LEAD_FORM) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle contact button click
  const handleContactClick = () => {
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle booking confirmation - this would be called after a successful booking
  const handleBookingConfirmed = () => {
    setIsModalOpen(false);
    setCurrentStep(Step.THANK_YOU);
  };

  // Add event listener for booking confirmation
  useEffect(() => {
    const bookingConfirmedHandler = () => {
      setCurrentStep(Step.THANK_YOU);
    };
    document.addEventListener('booking-confirmed', bookingConfirmedHandler);
    return () => {
      document.removeEventListener('booking-confirmed', bookingConfirmedHandler);
    };
  }, []);

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (scoreResults && formData) {
      downloadPDF(formData, scoreResults, recommendations);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSteps = 4; // Four sections in our questionnaire 
    const currentPosition = currentStep - Step.SECTION_1;
    return Math.round(currentPosition / totalSteps * 100);
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case Step.LEAD_FORM:
        return <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Audit Debt Scorecard</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">Assess the hidden audit debt in your organization and discover
actionable steps to resolve it</p>
              </div>
              
              <LeadForm onSubmit={handleLeadFormSubmit} />
            </div>
          </div>;
      case Step.SECTION_1:
      case Step.SECTION_2:
      case Step.SECTION_3:
      case Step.SECTION_4:
        const sectionIndex = currentStep - Step.SECTION_1;
        const section = scorecardSections[sectionIndex];
        return <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <QuestionSection sectionId={section.id} title={section.title} description={section.description} questions={section.questions} currentValues={formData.sections[section.id]} onValueChange={(questionId, value) => handleQuestionAnswer(section.id, questionId, value)} onNext={handleNextSection} onBack={currentStep > Step.SECTION_1 ? handleBackSection : undefined} isLastSection={currentStep === Step.SECTION_4} progress={calculateProgress()} />
            </div>
          </div>;
      case Step.RESULTS:
        return scoreResults ? <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ResultsOverview userInfo={formData} scoreResults={scoreResults} onContactClick={handleContactClick} onDownloadClick={handleDownloadPDF} />
              
              <Recommendations recommendations={recommendations} />
            </div>
          </div> : null;
      case Step.THANK_YOU:
        return <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ThankYou userInfo={formData} onDownloadReport={handleDownloadPDF} />
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <Layout>
      {renderStep()}
      
      {/* Booking Consultation Modal */}
      <BookConsultationModal isOpen={isModalOpen} onClose={handleModalClose} userInfo={formData} bookingUrl={bookingUrl} />
    </Layout>;
};
export default Index;