
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PageLayout from '@/components/layout/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const { isAuthenticated } = useRequireAuth();
  
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  
  if (loading || !isAuthenticated) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <p>Loading profile...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const initials = firstName && lastName 
    ? `${firstName[0]}${lastName[0]}`
    : user?.email?.substring(0, 2).toUpperCase() || 'UN';
  
  return (
    <PageLayout title="Your Profile" description="Manage your account information">
      <div className="container max-w-2xl mx-auto py-12">
        <Card className="bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border border-white/20">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile?.first_name || 'User'} />
                ) : null}
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-black/30"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your email address cannot be changed.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <CardFooter className="flex justify-end p-0 mt-6">
                <Button 
                  type="submit" 
                  disabled={isUpdating} 
                  className="cosmic-gradient"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Profile;
