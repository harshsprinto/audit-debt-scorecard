
import { FC, useState } from 'react';
import { UserInfo } from '@/types/scorecard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadFormProps {
  onSubmit: (userInfo: UserInfo) => void;
}

const LeadForm: FC<LeadFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserInfo>({
    fullName: '',
    email: '',
    company: '',
    designation: '',
    companySize: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof UserInfo]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (value: string, name: keyof UserInfo) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email: string): boolean => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    // Disallow personal domains
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const domain = email.split('@')[1].toLowerCase();
    return !personalDomains.includes(domain);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Partial<Record<keyof UserInfo, string>> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please use your work email';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
    }
    
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Audit Debt Scorecard</CardTitle>
        <CardDescription className="text-center">
          Assess your organization's hidden audit debt and get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'border-red-500' : ''}
              required
            />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Work Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500' : ''}
              required
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            <p className="text-xs text-gray-500">We'll send your personalized report to this email</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={errors.company ? 'border-red-500' : ''}
              required
            />
            {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size *</Label>
            <Select 
              onValueChange={(value) => handleSelectChange(value, 'companySize')}
              value={formData.companySize}
              required
            >
              <SelectTrigger className={errors.companySize ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-25">1-25 employees</SelectItem>
                <SelectItem value="26-100">26-100 employees</SelectItem>
                <SelectItem value="101-250">101-250 employees</SelectItem>
                <SelectItem value="251-500">251-500 employees</SelectItem>
                <SelectItem value="501-2000">501-2000 employees</SelectItem>
                <SelectItem value="2001-5000">2001-5000 employees</SelectItem>
                <SelectItem value="5001+">5001+ employees</SelectItem>
              </SelectContent>
            </Select>
            {errors.companySize && <p className="text-xs text-red-500">{errors.companySize}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="designation">Designation/Title *</Label>
            <Input
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={errors.designation ? 'border-red-500' : ''}
              required
            />
            {errors.designation && <p className="text-xs text-red-500">{errors.designation}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-sprinto-orange hover:bg-opacity-90 text-white"
          >
            Start Assessment
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Your information is secure and will only be used to personalize your assessment results.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadForm;
