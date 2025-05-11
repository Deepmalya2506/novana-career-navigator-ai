
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Users, Search, Plus, Menu } from 'lucide-react';
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

interface GroupListProps {
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  className?: string;
}

export const GroupList = ({ 
  selectedGroupId, 
  onSelectGroup,
  className
}: GroupListProps) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden mb-4 flex items-center">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mr-2">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="glass-card border-r border-white/10 w-80">
            <SheetHeader className="mb-4">
              <SheetTitle>Community Groups</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 overflow-y-auto max-h-[85vh]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="font-medium text-sm text-muted-foreground mb-2">
                    Your Groups
                  </div>
                  <div className="space-y-2 mb-4">
                    {filteredGroups.filter(g => g.is_member).length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        You haven't joined any groups yet.
                      </p>
                    ) : (
                      filteredGroups
                        .filter(g => g.is_member)
                        .map(group => (
                          <div 
                            key={group.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              selectedGroupId === group.id
                                ? 'bg-primary/20 border border-primary/50'
                                : 'hover:bg-muted glass-card'
                            }`}
                            onClick={() => {
                              onSelectGroup(group.id);
                              setMobileOpen(false);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{group.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {group._count?.members} {group._count?.members === 1 ? 'member' : 'members'}
                              </Badge>
                            </div>
                            {group.description && (
                              <p className="text-sm text-muted-foreground truncate">
                                {group.description}
                              </p>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLeaveGroup(group.id);
                              }}
                            >
                              Leave
                            </Button>
                          </div>
                        ))
                    )}
                  </div>
                  
                  <div className="font-medium text-sm text-muted-foreground mb-2">
                    Available Groups
                  </div>
                  <div className="space-y-2">
                    {filteredGroups.filter(g => !g.is_member).length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No available groups to join.
                      </p>
                    ) : (
                      filteredGroups
                        .filter(g => !g.is_member)
                        .map(group => (
                          <div 
                            key={group.id}
                            className="p-3 rounded-lg cursor-pointer hover:bg-muted glass-card"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{group.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {group._count?.members} {group._count?.members === 1 ? 'member' : 'members'}
                              </Badge>
                            </div>
                            {group.description && (
                              <p className="text-sm text-muted-foreground truncate">
                                {group.description}
                              </p>
                            )}
                            <Button
                              variant="default"
                              size="sm"
                              className="text-xs mt-2 cosmic-gradient"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinGroup(group.id);
                              }}
                            >
                              Join Group
                            </Button>
                          </div>
                        ))
                    )}
                  </div>
                  
                  {user && (
                    <div className="pt-4 border-t border-border">
                      <div className="font-medium text-sm mb-2">Create New Group</div>
                      <div className="space-y-2">
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
                        <Button 
                          onClick={handleCreateGroup}
                          disabled={!newGroupName.trim() || creating}
                          className="w-full cosmic-gradient"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Group
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop View */}
      <div className={`hidden lg:block ${className || ''}`}>
        <div className="space-y-4">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Groups</h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="font-medium text-sm text-muted-foreground mb-2">
                Your Groups
              </div>
              <div className="space-y-2 mb-4">
                {filteredGroups.filter(g => g.is_member).length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    You haven't joined any groups yet.
                  </p>
                ) : (
                  filteredGroups
                    .filter(g => g.is_member)
                    .map(group => (
                      <div 
                        key={group.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedGroupId === group.id
                            ? 'bg-primary/20 border border-primary/50'
                            : 'hover:bg-muted glass-card'
                        }`}
                        onClick={() => onSelectGroup(group.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{group.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {group._count?.members} {group._count?.members === 1 ? 'member' : 'members'}
                          </Badge>
                        </div>
                        {group.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {group.description}
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeaveGroup(group.id);
                          }}
                        >
                          Leave
                        </Button>
                      </div>
                    ))
                )}
              </div>
              
              <div className="font-medium text-sm text-muted-foreground mb-2">
                Available Groups
              </div>
              <div className="space-y-2">
                {filteredGroups.filter(g => !g.is_member).length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No available groups to join.
                  </p>
                ) : (
                  filteredGroups
                    .filter(g => !g.is_member)
                    .map(group => (
                      <div 
                        key={group.id}
                        className="p-3 rounded-lg cursor-pointer hover:bg-muted glass-card"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{group.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {group._count?.members} {group._count?.members === 1 ? 'member' : 'members'}
                          </Badge>
                        </div>
                        {group.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {group.description}
                          </p>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          className="text-xs mt-2 cosmic-gradient"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(group.id);
                          }}
                        >
                          Join Group
                        </Button>
                      </div>
                    ))
                )}
              </div>
              
              {user && (
                <div className="pt-4 border-t border-border">
                  <div className="font-medium text-sm mb-2">Create New Group</div>
                  <div className="space-y-2">
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
                    <Button 
                      onClick={handleCreateGroup}
                      disabled={!newGroupName.trim() || creating}
                      className="w-full cosmic-gradient"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Group
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
