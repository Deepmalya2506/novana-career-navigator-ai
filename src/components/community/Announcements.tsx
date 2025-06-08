
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface AnnouncementProfile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  profiles?: AnnouncementProfile | null;
}

export const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch announcements
        const { data, error } = await supabase
          .from('community_announcements')
          .select(`
            *,
            profiles:created_by(first_name, last_name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        // Process the data to handle the profile relationship
        const processedData = data?.map(item => ({
          ...item,
          profiles: item.profiles && typeof item.profiles === 'object' && !Array.isArray(item.profiles) 
            ? item.profiles as AnnouncementProfile 
            : null
        })) || [];
        
        setAnnouncements(processedData);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        toast.error('Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getAuthorName = (announcement: Announcement) => {
    if (!announcement.profiles) return 'Unknown User';
    const firstName = announcement.profiles.first_name || '';
    const lastName = announcement.profiles.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="glass-card">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card className="glass-card text-center py-12">
        <CardContent>
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Announcements</h3>
          <p className="text-muted-foreground">
            There are no community announcements at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="glass-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>{announcement.title}</CardTitle>
            <CardDescription>
              Posted by {getAuthorName(announcement)} on {formatDate(announcement.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{announcement.content}</p>
          </CardContent>
          <CardFooter className="border-t border-border pt-4 flex justify-between">
            <Badge variant="outline" className="ml-auto">
              <Bell className="h-3 w-3 mr-1" />
              Announcement
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
