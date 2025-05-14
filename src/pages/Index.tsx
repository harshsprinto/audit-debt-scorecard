import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import LeadForm from '@/components/scorecard/LeadForm';
import QuestionSection from '@/components/scorecard/QuestionSection';
import ResultsOverview from '@/components/scorecard/ResultsOverview';
import Recommendations from '@/components/scorecard/Recommendations';
import BookConsultationModal from '@/components/scorecard/BookConsultationModal';
import ThankYou from '@/components/scorecard/ThankYou';
import { scorecardSections } from '@/data/questions';
import { FormData, UserInfo, AuditDebtScore, RecommendationItem } from '@/types/scorecard';
import { calculateScore, generateRecommendations } from '@/utils/scorecardUtils';
import { downloadPDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

// Define the steps of the scorecard flow
enum Step {
  LEAD_FORM,
  SECTION_1,
  SECTION_2,
  SECTION_3,
  SECTION_4,
  SECTION_5,
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
    companySize: '',
    sections: {
      complianceMaturity: {},
      toolingAutomation: {},
      securityOperations: {},
      auditReadiness: {},
      changeManagement: {}
    }
  });

  // State for results
  const [scoreResults, setScoreResults] = useState<AuditDebtScore | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  // State for the consultation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingUrl] = useState('https://sprinto.com/get-a-demo/?utm_source=audit+debt+scorecard');

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
    } else if (currentStep === Step.RESULTS) {
      // If we're already on results, do nothing
      return;
    } else {
      // Calculate final score and show results only when transitioning to results page
      calculateAndShowResults();
    }
  };

  // Calculate scores and update state with results
  const calculateAndShowResults = () => {
    try {
      console.log("Calculating scores with form data:", formData);
      const results = calculateScore(formData);
      console.log("Score calculation results:", results);
      
      const recs = generateRecommendations(results);
      console.log("Generated recommendations:", recs);
      
      setScoreResults(results);
      setRecommendations(recs);
      setCurrentStep(Step.RESULTS);
    } catch (error) {
      console.error("Error calculating results:", error);
      // Fallback to default values if there's an error
      setScoreResults({
        overallScore: 50,
        overallRiskLevel: 'Moderate',
        sections: [
          {
            id: 'complianceMaturity',
            title: 'Compliance Program Maturity',
            score: 7,
            maxScore: 15,
            riskLevel: 'Moderate'
          },
          {
            id: 'toolingAutomation',
            title: 'Tooling & Automation',
            score: 6,
            maxScore: 15,
            riskLevel: 'Significant'
          },
          {
            id: 'securityOperations',
            title: 'Security Operations',
            score: 8,
            maxScore: 15,
            riskLevel: 'Moderate'
          },
          {
            id: 'auditReadiness',
            title: 'Audit Readiness',
            score: 9,
            maxScore: 15,
            riskLevel: 'Moderate'
          },
          {
            id: 'changeManagement',
            title: 'Change Management & Vendor Risk',
            score: 8,
            maxScore: 15,
            riskLevel: 'Moderate'
          }
        ]
      });
      setRecommendations([
        {
          title: 'Implement a Centralized Compliance Platform to Reduce Manual Audit Debt',
          description: 'Replace manual processes and spreadsheets with a dedicated compliance automation solution.',
          priority: 'High'
        },
        {
          title: 'Automate Evidence Collection to Cut Down Operational Audit Debt',
          description: 'Reduce manual effort and human error by automating the collection of compliance evidence.',
          priority: 'Medium'
        },
        {
          title: 'Establish Regular Access Reviews',
          description: 'Implement quarterly or more frequent access reviews to maintain proper access control.',
          priority: 'Medium'
        }
      ]);
      setCurrentStep(Step.RESULTS);
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

  // Handle PDF download - made available for sharing
  const handleDownloadPDF = () => {
    if (scoreResults && formData) {
      downloadPDF(formData, scoreResults, recommendations);
    }
  };

  // Handle sharing
  const handleShare = (method: string) => {
    if (!scoreResults || !formData) {
      toast.error("Unable to share. Report data is missing.");
      return;
    }
    
    // First download/generate the PDF
    handleDownloadPDF();
    
    switch (method) {
      case 'email':
        window.open(`mailto:?subject=Audit Debt Report for ${formData.company}&body=I'm sharing the Audit Debt Report for ${formData.company}. Please see the attached PDF for the complete report.`);
        toast.success("Email client opened. Please attach the downloaded PDF.");
        break;
      case 'linkedin':
        toast.success("PDF downloaded. Please attach it to your LinkedIn post.");
        window.open('https://www.linkedin.com/sharing/share-offsite/');
        break;
      case 'slack':
        toast.success("PDF downloaded. Please upload it to your Slack conversation.");
        break;
      default:
        console.log(`Sharing via ${method} not implemented yet`);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSteps = 5; // Five sections in our questionnaire 
    const currentPosition = currentStep - Step.SECTION_1;
    return Math.round(currentPosition / totalSteps * 100);
  };

  // Fix: When user reaches SECTION_5 and clicks "See Results", calculate scores and proceed
  useEffect(() => {
    if (currentStep === Step.SECTION_5) {
      // Pre-calculate results so they're ready when user clicks "See Results"
      const results = calculateScore(formData);
      setScoreResults(results);
      setRecommendations(generateRecommendations(results));
    }
  }, [formData, currentStep]);

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
      case Step.SECTION_5:
        const sectionIndex = currentStep - Step.SECTION_1;
        const section = scorecardSections[sectionIndex];
        
        // If we're at last section, prepare next action to calculate and show results
        const onNextAction = currentStep === Step.SECTION_5 ? () => {
          calculateAndShowResults();
        } : handleNextSection;
        
        return <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <QuestionSection 
                sectionId={section.id} 
                title={section.title} 
                description={section.description} 
                questions={section.questions} 
                currentValues={formData.sections[section.id]} 
                onValueChange={(questionId, value) => handleQuestionAnswer(section.id, questionId, value)} 
                onNext={onNextAction}
                onBack={currentStep > Step.SECTION_1 ? handleBackSection : undefined} 
                isLastSection={currentStep === Step.SECTION_5} 
                progress={calculateProgress()} 
              />
            </div>
          </div>;
      case Step.RESULTS:
        // Make sure we have results before showing this page
        console.log("Rendering results page with data:", { scoreResults, recommendations });
        if (!scoreResults) {
          console.error("No score results available");
          // If no results, calculate them now
          calculateAndShowResults();
          return <div className="py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Calculating your results...</h2>
                </div>
              </div>
            </div>;
        }
        
        return <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ResultsOverview 
                userInfo={formData} 
                scoreResults={scoreResults} 
                onContactClick={handleContactClick} 
                onDownloadClick={handleDownloadPDF}
                onShareClick={handleShare}
              />
              
              <Recommendations recommendations={recommendations} />
            </div>
          </div>;
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
