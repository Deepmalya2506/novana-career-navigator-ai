
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardUser {
  user_id: string;
  activity_points: number;
  messages_sent: number;
  groups_joined: number;
  last_active: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  }
}

export const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const { data, error } = await supabase
          .from('user_activity')
          .select(`
            user_id,
            activity_points,
            messages_sent,
            groups_joined,
            last_active,
            profiles:user_id(first_name, last_name, avatar_url)
          `)
          .order('activity_points', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        setUsers(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
    
    // Set up a real-time subscription for leaderboard updates
    const channel = supabase
      .channel('leaderboard-changes')
      .on('postgres_changes', 
        { 
          event: '*',
          schema: 'public',
          table: 'user_activity'
        }, 
        () => {
          fetchLeaderboardData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const getInitials = (user: LeaderboardUser) => {
    if (!user.profiles) return 'U';
    const firstName = user.profiles.first_name || '';
    const lastName = user.profiles.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };
  
  const getName = (user: LeaderboardUser) => {
    if (!user.profiles) return 'Unknown User';
    const firstName = user.profiles.first_name || '';
    const lastName = user.profiles.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown User';
  };
  
  const getRankBadge = (index: number) => {
    if (index === 0) {
      return <Badge className="bg-yellow-500 text-black">🏆 1st</Badge>;
    } else if (index === 1) {
      return <Badge className="bg-gray-400 text-black">🥈 2nd</Badge>;
    } else if (index === 2) {
      return <Badge className="bg-amber-700 text-white">🥉 3rd</Badge>;
    }
    return <Badge variant="outline">{index + 1}th</Badge>;
  };
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Community Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-12 ml-auto" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No users data yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={user.user_id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 text-sm font-medium">
                    {getRankBadge(index)}
                  </div>
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={user.profiles?.avatar_url || ''} />
                    <AvatarFallback className={index < 3 ? 'bg-primary/80' : ''}>
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{getName(user)}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{user.groups_joined} groups</span>
                      <span>•</span>
                      <span>{user.messages_sent} messages</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{user.activity_points} pts</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
