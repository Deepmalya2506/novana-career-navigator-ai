
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProfileData {
  name: string;
  objective: string;
  goals: string;
  targetRoles: string[];
}

interface ProfileCustomizationProps {
  onSave: (profileData: ProfileData) => void;
  initialData?: ProfileData;
}

const ProfileCustomization = ({ onSave, initialData }: ProfileCustomizationProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(
    initialData || {
      name: '',
      objective: '',
      goals: '',
      targetRoles: ['Software Engineer'],
    }
  );
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

  const handleSave = () => {
    onSave(profileData);
    setIsDialogOpen(false);
    toast({
      title: "Profile Updated",
      description: "Your career profile has been updated successfully.",
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
        <DialogContent className="glass-card max-w-2xl">
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
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileCustomization;
