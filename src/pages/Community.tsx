
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { GroupList } from '@/components/community/GroupList';
import { GroupCards } from '@/components/community/GroupCards';
import { Announcements } from '@/components/community/Announcements';
import { ChatInterface } from '@/components/community/ChatInterface';
import { GroupDetails } from '@/components/community/GroupDetails';
import { Leaderboard } from '@/components/community/Leaderboard';
import { Separator } from '@/components/ui/separator';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Loader2, Bell, MessageCircle } from 'lucide-react';

const Community = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useRequireAuth();
  const { user } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("groups");
  
  if (authLoading) {
    return (
      <PageLayout
        title="Community"
        description="Join the NOVANA community to learn, share, and grow together"
      >
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      </PageLayout>
    );
  }
  
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }
  
  return (
    <PageLayout
      title="Community"
      description="Join the NOVANA community to learn, share, and grow together"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 -right-64 w-[600px] h-[600px] bg-novana-purple/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-novana-blue/20 rounded-full blur-[100px]" />
      </div>

      <section className="container mx-auto px-4 py-6">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden mb-8">
          <div className="absolute inset-0 opacity-30 z-0">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-novana-purple/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-novana-blue/30 rounded-full blur-[80px]" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 cosmic-text">Welcome to the NOVANA Community</h2>
            <p className="text-white/80 mb-6">
              Connect with fellow learners, share your experiences, ask questions, and collaborate on projects.
              Join groups based on your interests and engage in real-time discussions.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar with Leaderboard */}
          <div className="lg:col-span-3">
            {/* Mobile view is handled within the component */}
            <GroupList 
              selectedGroupId={selectedGroupId} 
              onSelectGroup={setSelectedGroupId}
              className="glass-card p-4 hidden lg:block"
            />
            
            <div className="mt-6">
              <Leaderboard />
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Tabs defaultValue="groups" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="groups" className="flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Groups & Chats
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Announcements
                </TabsTrigger>
              </TabsList>
              
              {/* Groups Tab */}
              <TabsContent value="groups" className="space-y-6">
                <div className="block lg:hidden">
                  <GroupCards
                    selectedGroupId={selectedGroupId}
                    onSelectGroup={setSelectedGroupId}
                  />
                </div>
                
                {selectedGroupId ? (
                  <Card className="glass-card">
                    <div className="border-b border-border p-4 flex items-center justify-between">
                      <h2 className="font-semibold">Chat</h2>
                      <GroupDetails groupId={selectedGroupId} />
                    </div>
                    <ChatInterface groupId={selectedGroupId} />
                  </Card>
                ) : (
                  <Card className="glass-card p-12 flex flex-col items-center justify-center text-center h-[60vh]">
                    <h3 className="text-xl font-semibold mb-2">Select a Group to Start Chatting</h3>
                    <p className="text-muted-foreground">
                      Join an existing group or create your own to begin conversations with the community.
                    </p>
                  </Card>
                )}
              </TabsContent>
              
              {/* Announcements Tab */}
              <TabsContent value="announcements">
                <Announcements />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Community;
