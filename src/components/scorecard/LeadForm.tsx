
import { FC, useState, useEffect } from 'react';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface LeadFormProps {
  onSubmit: (userInfo: UserInfo) => void;
}

// Define team options and their corresponding designations
const teamOptions = [
  {
    value: 'cxo',
    label: 'CXO Level',
    designations: ['CEO', 'COO', 'CTO', 'CISO', 'CFO', 'CMO', 'CHRO']
  },
  {
    value: 'compliance',
    label: 'Compliance and Security',
    designations: ['Compliance Officer', 'Compliance Manager', 'Risk Manager', 'Security Analyst', 'Security Engineer', 'GRC Specialist', 'Risk and Compliance Lead']
  },
  {
    value: 'product',
    label: 'Product and Engineering',
    designations: ['Product Manager', 'Engineering Manager', 'Software Engineer', 'DevOps Engineer', 'QA Engineer', 'Technical Lead']
  },
  {
    value: 'it',
    label: 'IT and Operations',
    designations: ['IT Manager', 'System Administrator', 'Network Engineer', 'Operations Manager', 'Support Engineer']
  },
  {
    value: 'sales',
    label: 'Sales and Marketing',
    designations: ['Sales Manager', 'Account Executive', 'Business Development Manager', 'Marketing Manager', 'Growth Manager', 'Customer Success Manager']
  },
  {
    value: 'others',
    label: 'Others',
    designations: ['Consultant', 'Advisor', 'Partner', 'Analyst', 'Specialist']
  }
];

const LeadForm: FC<LeadFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Omit<UserInfo, 'company'> & { team: string }>({
    fullName: '',
    email: '',
    companySize: '',
    designation: '',
    team: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo | 'team', string>>>({});
  const [availableDesignations, setAvailableDesignations] = useState<string[]>([]);

  // Update available designations when team changes
  useEffect(() => {
    if (formData.team) {
      const selectedTeam = teamOptions.find(team => team.value === formData.team);
      if (selectedTeam) {
        setAvailableDesignations(selectedTeam.designations);
        // Reset designation when team changes
        setFormData(prev => ({ ...prev, designation: '' }));
      }
    } else {
      setAvailableDesignations([]);
    }
  }, [formData.team]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof UserInfo]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (value: string, name: keyof UserInfo | 'team') => {
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
    const newErrors: Partial<Record<keyof UserInfo | 'team', string>> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please use your work email';
    }
    
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
    }
    
    if (!formData.team) {
      newErrors.team = 'Team is required';
    }
    
    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit without the team field and add empty company field to match expected UserInfo type
    const userInfo: UserInfo = {
      fullName: formData.fullName,
      email: formData.email,
      company: '', // Providing empty string to match the expected UserInfo type
      companySize: formData.companySize,
      designation: formData.designation,
    };
    
    onSubmit(userInfo);
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
          
          {/* Team Selection Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="team">Team *</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, 'team')}
              value={formData.team}
              required
            >
              <SelectTrigger className={errors.team ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your team" />
              </SelectTrigger>
              <SelectContent>
                {teamOptions.map((team) => (
                  <SelectItem key={team.value} value={team.value}>{team.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.team && <p className="text-xs text-red-500">{errors.team}</p>}
          </div>
          
          {/* Designation Dropdown (conditional on team selection) */}
          <div className="space-y-2">
            <Label htmlFor="designation">Designation/Title *</Label>
            <Select
              onValueChange={(value) => handleSelectChange(value, 'designation')}
              value={formData.designation}
              disabled={!formData.team}
              required
            >
              <SelectTrigger className={errors.designation ? 'border-red-500' : ''}>
                <SelectValue placeholder={formData.team ? "Select your designation" : "First select a team"} />
              </SelectTrigger>
              <SelectContent>
                {availableDesignations.map((designation) => (
                  <SelectItem key={designation} value={designation}>{designation}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
