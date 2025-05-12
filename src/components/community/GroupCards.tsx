
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, Plus, UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  _count?: {
    members: number;
  };
  is_member?: boolean;
}

interface GroupCardsProps {
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
}

export const GroupCards = ({ selectedGroupId, onSelectGroup }: GroupCardsProps) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get all groups
        const { data: groupsData, error: groupsError } = await supabase
          .from('community_groups')
          .select('*');
          
        if (groupsError) throw groupsError;
        
        // Get all groups the user is a member of
        const { data: membershipData, error: membershipError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user.id);
          
        if (membershipError) throw membershipError;
        
        // Get member count for each group
        const groupWithMemberCounts = await Promise.all(
          groupsData.map(async (group) => {
            const { count, error } = await supabase
              .from('group_members')
              .select('*', { count: 'exact' })
              .eq('group_id', group.id);
              
            const isMember = membershipData.some(m => m.group_id === group.id);
            
            return {
              ...group,
              _count: { members: count || 0 },
              is_member: isMember
            };
          })
        );
        
        setGroups(groupWithMemberCounts);
        
        // If there are groups and none selected, select the first one
        if (groupWithMemberCounts.length > 0 && !selectedGroupId) {
          const firstJoinedGroup = groupWithMemberCounts.find(g => g.is_member);
          if (firstJoinedGroup) {
            onSelectGroup(firstJoinedGroup.id);
          }
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, [user, selectedGroupId, onSelectGroup]);

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast.error('You need to be logged in to join groups');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id
        });
        
      if (error) throw error;
      
      // Update groups list
      setGroups(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { 
                ...group, 
                is_member: true,
                _count: { members: (group._count?.members || 0) + 1 } 
              } 
            : group
        )
      );
      
      // Select the joined group
      onSelectGroup(groupId);
      
      // Update user activity
      await supabase
        .from('user_activity')
        .upsert({
          user_id: user.id,
          groups_joined: groups.filter(g => g.is_member).length + 1,
          last_active: new Date().toISOString(),
          activity_points: groups.filter(g => g.is_member).length * 10 + 20
        });
      
      toast.success('Joined group successfully');
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update groups list
      setGroups(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { 
                ...group, 
                is_member: false,
                _count: { members: Math.max(0, (group._count?.members || 1) - 1) } 
              } 
            : group
        )
      );
      
      // If we left the selected group, select another group
      if (selectedGroupId === groupId) {
        const nextGroup = groups.find(g => g.is_member && g.id !== groupId);
        if (nextGroup) {
          onSelectGroup(nextGroup.id);
        } else {
          onSelectGroup('');
        }
      }
      
      // Update user activity
      await supabase
        .from('user_activity')
        .update({
          groups_joined: Math.max(0, groups.filter(g => g.is_member).length - 1),
          last_active: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      toast.success('Left group successfully');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const handleCreateGroup = async () => {
    if (!user) return;
    if (!newGroupName.trim()) {
      toast.error('Group name cannot be empty');
      return;
    }
    
    try {
      setCreating(true);
      
      // Create new group
      const { data, error } = await supabase
        .from('community_groups')
        .insert({
          name: newGroupName,
          description: newGroupDescription || null,
          created_by: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Join the group automatically
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: data.id,
          user_id: user.id,
          is_admin: true
        });
        
      if (joinError) throw joinError;
      
      // Update local state
      setGroups(prev => [
        ...prev,
        { 
          ...data, 
          _count: { members: 1 },
          is_member: true
        }
      ]);
      
      // Select the new group
      onSelectGroup(data.id);
      
      // Reset form
      setNewGroupName('');
      setNewGroupDescription('');
      
      toast.success('Group created successfully');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <>
          {filteredGroups.filter(g => g.is_member).length > 0 && (
            <>
              <h3 className="text-lg font-medium mb-3">Your Groups</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(g => g.is_member).map(group => (
                  <Card 
                    key={group.id}
                    className={`glass-card overflow-hidden cursor-pointer transition-all ${
                      selectedGroupId === group.id
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                        : ''
                    }`}
                    onClick={() => onSelectGroup(group.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-novana-purple/30 to-novana-blue/10 opacity-20" />
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {group.name}
                        <Badge variant="outline" className="ml-2">
                          {group._count?.members} {group._count?.members === 1 ? 'member' : 'members'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {group.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="bg-background/5 border-t border-border pt-3 flex justify-between">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                        <UserCheck className="mr-1 h-3 w-3" />
                        Member
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveGroup(group.id);
                        }}
                      >
                        Leave
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {filteredGroups.filter(g => !g.is_member).length > 0 && (
            <>
              <h3 className="text-lg font-medium mb-3 mt-6">Available Groups</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(g => !g.is_member).map(group => (
                  <Card 
                    key={group.id}
                    className="glass-card overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-novana-blue/20 to-novana-purple/10 opacity-10" />
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {group.name}
                        <Badge variant="outline" className="ml-2">
                          {group._count?.members} {group._count?.members === 1 ? 'member' : 'members'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {group.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="bg-background/5 border-t border-border pt-3">
                      <Button
                        variant="default"
                        size="sm"
                        className="cosmic-gradient w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinGroup(group.id);
                        }}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Join Group
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
              <CardDescription>Start your own community group</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || creating}
                className="w-full cosmic-gradient"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};
