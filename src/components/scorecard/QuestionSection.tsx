
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Question } from '@/data/questions';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface QuestionSectionProps {
  sectionId: string;
  title: string;
  description: string;
  questions: Question[];
  currentValues: Record<string, any>;
  onValueChange: (questionId: string, value: any) => void;
  onNext: () => void;
  onBack?: () => void;
  isLastSection?: boolean;
  progress: number;
}

const QuestionSection: FC<QuestionSectionProps> = ({
  sectionId,
  title,
  description,
  questions,
  currentValues,
  onValueChange,
  onNext,
  onBack,
  isLastSection = false,
  progress
}) => {
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  const isComplete = questions.every(q => 
    currentValues[q.id] !== undefined && 
    (Array.isArray(currentValues[q.id]) ? currentValues[q.id].length > 0 : true)
  );

  const handleChange = (questionId: string, value: any) => {
    onValueChange(questionId, value);
    setAnswered(prev => {
      const updated = new Set(prev);
      updated.add(questionId);
      return updated;
    });
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'select':
        return (
          <Select
            value={currentValues[question.id] || ''}
            onValueChange={(value) => handleChange(question.id, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={currentValues[question.id] || ''}
            onValueChange={(value) => handleChange(question.id, value)}
            className="flex flex-col space-y-3"
          >
            {question.options?.map(option => (
              <div key={option.value} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} className="mt-1" />
                <Label htmlFor={`${question.id}-${option.value}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'slider':
        return (
          <div className="space-y-4 px-2">
            <Slider
              value={[currentValues[question.id] || question.min || 0]}
              min={question.min || 0}
              max={question.max || 100}
              step={question.step || 1}
              onValueChange={(value) => handleChange(question.id, value[0])}
              className="my-6"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{question.min || 0}</span>
              <span>{question.max || 100}</span>
            </div>
            <div className="text-center font-medium text-gray-800 dark:text-gray-200">
              Current: {currentValues[question.id] || question.min || 0}
            </div>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-3">
            {question.options?.map(option => (
              <div key={option.value} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Checkbox
                  id={`${question.id}-${option.value}`}
                  checked={(currentValues[question.id] || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentArr = [...(currentValues[question.id] || [])];
                    if (checked) {
                      handleChange(question.id, [...currentArr, option.value]);
                    } else {
                      handleChange(
                        question.id,
                        currentArr.filter(val => val !== option.value)
                      );
                    }
                  }}
                  className="mt-1"
                />
                <Label htmlFor={`${question.id}-${option.value}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{progress}% completed</span>
          </div>
          <Progress value={progress} className="h-3 w-full" />
        </div>
        
        <Card className="shadow-lg border-0 dark:border dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 leading-tight">
              {title}
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-2">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:pb-0">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-sprinto-orange text-white text-xs font-bold rounded-full flex items-center justify-center mt-1">
                    {index + 1}
                  </span>
                  <Label className="font-medium text-gray-900 dark:text-gray-100 text-base leading-relaxed flex-1">
                    {question.text}
                  </Label>
                </div>
                <div className="ml-9">
                  {renderQuestion(question)}
                </div>
              </div>
            ))}
            
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6">
              {onBack ? (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="w-full sm:w-auto order-2 sm:order-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Back
                </Button>
              ) : (
                <div className="hidden sm:block"></div>
              )}
              
              <Button
                onClick={onNext}
                disabled={!isComplete}
                className="w-full sm:w-auto order-1 sm:order-2 bg-sprinto-orange hover:bg-sprinto-orange/90 text-white disabled:opacity-50 disabled:cursor-not-allowed py-3"
              >
                {isLastSection ? 'See Results' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default QuestionSection;
