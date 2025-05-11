
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Info, 
  Crown, 
  UserCheck,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface Member {
  id: string;
  user_id: string;
  joined_at: string;
  is_admin: boolean;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  }
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  created_by: string;
}

interface GroupDetailsProps {
  groupId: string;
}

export const GroupDetails = ({ groupId }: GroupDetailsProps) => {
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) return;
      
      try {
        setLoading(true);
        
        // Fetch group details
        const { data: groupData, error: groupError } = await supabase
          .from('community_groups')
          .select('*')
          .eq('id', groupId)
          .single();
          
        if (groupError) throw groupError;
        
        setGroup(groupData);
        
        // Fetch members
        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select(`
            id,
            user_id,
            joined_at,
            is_admin,
            profiles:user_id(first_name, last_name, avatar_url)
          `)
          .eq('group_id', groupId);
          
        if (membersError) throw membersError;
        
        setMembers(membersData);
        
        // Check if current user is admin
        if (user) {
          const adminMember = membersData.find(m => 
            m.user_id === user.id && m.is_admin
          );
          setIsAdmin(!!adminMember);
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
        toast.error('Failed to load group details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupDetails();
  }, [groupId, user]);
  
  const handlePromoteToAdmin = async (memberId: string, userId: string) => {
    if (!isAdmin || !user) return;
    
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ is_admin: true })
        .eq('id', memberId);
        
      if (error) throw error;
      
      setMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, is_admin: true } 
            : member
        )
      );
      
      toast.success('Member promoted to admin');
    } catch (error) {
      console.error('Error promoting member:', error);
      toast.error('Failed to promote member');
    }
  };
  
  const handleRemoveFromGroup = async (memberId: string, userId: string) => {
    if (!isAdmin || !user || userId === user.id) return;
    
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      setMembers(prev => prev.filter(member => member.id !== memberId));
      
      toast.success('Member removed from group');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };
  
  const getInitials = (member: Member) => {
    if (!member.profiles) return 'U';
    const firstName = member.profiles.first_name || '';
    const lastName = member.profiles.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };
  
  const getName = (member: Member) => {
    if (!member.profiles) return 'Unknown User';
    const firstName = member.profiles.first_name || '';
    const lastName = member.profiles.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown User';
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Info className="h-4 w-4" />
          <span className="hidden md:inline">Group Info</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="glass-card border-l border-white/10">
        <SheetHeader>
          <SheetTitle>Group Details</SheetTitle>
          {loading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <SheetDescription>{group?.name}</SheetDescription>
          )}
        </SheetHeader>
        
        <div className="mt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">About</h3>
                <p className="text-sm text-muted-foreground">
                  {group?.description || 'No description provided.'}
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <div className="flex items-center mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  <h3 className="text-sm font-medium">Members ({members.length})</h3>
                </div>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={member.profiles?.avatar_url || ''} />
                          <AvatarFallback>{getInitials(member)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {getName(member)}
                            {member.user_id === user?.id && " (You)"}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            {member.is_admin ? (
                              <span className="flex items-center">
                                <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                                Admin
                              </span>
                            ) : (
                              <span>Member</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isAdmin && user?.id !== member.user_id && (
                        <div className="flex gap-1">
                          {!member.is_admin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handlePromoteToAdmin(member.id, member.user_id)}
                            >
                              <UserCheck className="h-4 w-4" />
                              <span className="sr-only">Promote to Admin</span>
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                            onClick={() => handleRemoveFromGroup(member.id, member.user_id)}
                          >
                            <UserMinus className="h-4 w-4" />
                            <span className="sr-only">Remove from group</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
