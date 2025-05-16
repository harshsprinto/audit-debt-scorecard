
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
            className="flex flex-col space-y-2"
          >
            {question.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'slider':
        return (
          <div className="space-y-4">
            <Slider
              value={[currentValues[question.id] || question.min || 0]}
              min={question.min || 0}
              max={question.max || 100}
              step={question.step || 1}
              onValueChange={(value) => handleChange(question.id, value[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{question.min || 0}</span>
              <span>{question.max || 100}</span>
            </div>
            <div className="text-center font-medium">
              Current: {currentValues[question.id] || question.min || 0}
            </div>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
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
                />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
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
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm font-medium">{progress}% completed</span>
          </div>
          <Progress value={progress} className="h-2 w-full bg-gray-200" />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {questions.map(question => (
              <div key={question.id} className="space-y-2">
                <Label className="font-medium block mb-2">{question.text}</Label>
                {renderQuestion(question)}
              </div>
            ))}
            
            <div className="flex justify-between mt-6">
              {onBack ? (
                <Button
                  variant="outline"
                  onClick={onBack}
                >
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button
                onClick={onNext}
                disabled={!isComplete}
                className="bg-sprinto-orange hover:bg-opacity-90 text-white"
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
