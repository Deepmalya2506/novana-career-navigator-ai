
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check, Plus, Save, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

export interface ProfileData {
  name: string;
  objective: string;
  goals: string;
  targetRoles: string[];
  dreamJob?: string;
}

interface ProfileCustomizationProps {
  onSave: (profileData: ProfileData) => void;
  initialData?: ProfileData;
}

const PROFILE_STORAGE_KEY = 'careerProfileData';

const ProfileCustomization = ({ onSave, initialData }: ProfileCustomizationProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(
    initialData || {
      name: '',
      objective: '',
      goals: '',
      targetRoles: ['Software Engineer'],
      dreamJob: '',
    }
  );
  const [customRole, setCustomRole] = useState('');
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: string) => {
    setProfileData((prev) => {
      if (prev.targetRoles.includes(role)) {
        return {
          ...prev,
          targetRoles: prev.targetRoles.filter((r) => r !== role),
        };
      } else {
        return {
          ...prev,
          targetRoles: [...prev.targetRoles, role],
        };
      }
    });
  };

  const handleAddCustomRole = () => {
    if (customRole.trim()) {
      setProfileData((prev) => ({
        ...prev,
        targetRoles: [...prev.targetRoles, customRole.trim()],
        dreamJob: customRole.trim(),
      }));
      setCustomRole('');
      
      toast({
        title: "Dream Job Added",
        description: `Added "${customRole}" as your dream job goal.`,
      });
    }
  };

  const handleDreamJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      dreamJob: e.target.value
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
    
    // Call onSave prop to update parent component
    onSave(profileData);
    setIsDialogOpen(false);
    
    toast({
      title: "Profile Saved",
      description: "Your career profile has been saved successfully.",
    });
  };

  const commonRoles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'DevOps Engineer',
    'UX Designer',
    'Full Stack Developer',
    'Machine Learning Engineer',
  ];

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant="outline" 
        className="glass-button mb-6"
      >
        Customize Career Profile
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card max-w-2xl max-h-[96vh] overflow-y-auto mx-auto my-[2vh] fixed inset-x-[2%] top-[2vh] bottom-[2vh] left-1/2 transform -translate-x-1/2">
          <DialogHeader>
            <DialogTitle className="cosmic-text text-xl">Customize Your Career Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="glass-input"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Career Objective</label>
              <Textarea
                name="objective"
                value={profileData.objective}
                onChange={handleChange}
                placeholder="What's your main career objective?"
                className="glass-input min-h-20"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Short-term Goals</label>
              <Textarea
                name="goals"
                value={profileData.goals}
                onChange={handleChange}
                placeholder="What are your short-term goals?"
                className="glass-input min-h-20"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Target Roles</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonRoles.map((role) => (
                  <div
                    key={role}
                    className={`px-3 py-1 rounded-full cursor-pointer border transition-colors ${
                      profileData.targetRoles.includes(role)
                        ? "bg-primary/20 border-primary"
                        : "bg-white/5 border-white/20 hover:bg-white/10"
                    }`}
                    onClick={() => handleRoleChange(role)}
                  >
                    <div className="flex items-center space-x-1">
                      {profileData.targetRoles.includes(role) && (
                        <Check size={14} className="text-primary" />
                      )}
                      <span>{role}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 border-t border-white/10 pt-4">
                <label className="text-xl font-medium mb-2 block cosmic-text">Dream Job</label>
                <p className="text-sm text-white/70 mb-3">
                  Enter your dream job title and we'll generate a personalized roadmap to help you get there
                </p>
                
                <div className="space-y-4">
                  <Input
                    value={profileData.dreamJob || ''}
                    onChange={handleDreamJobChange}
                    placeholder="E.g., AI Research Scientist, Game Developer, Cloud Architect"
                    className="glass-input"
                  />
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-xs text-white/50">OR</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="Add custom role"
                      className="glass-input"
                    />
                    <Button 
                      onClick={handleAddCustomRole}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      disabled={!customRole.trim()}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-white/60">
                    This will help us tailor your career roadmap with specific skills and resources
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2" size={16} />
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileCustomization;
