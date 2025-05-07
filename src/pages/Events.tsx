
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Calendar, Clock, Filter, Search, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRelevantEvents, EventData } from '@/utils/geminiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileData } from '@/components/career/ProfileCustomization';

const SAMPLE_EVENTS = [
  {
    id: "1",
    title: "Microsoft Developer Conference",
    date: "May 20, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Seattle, WA",
    type: "Conference",
    description: "Join Microsoft experts to learn about the latest developer tools and technologies.",
    url: "https://example.com/microsoft-conference",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Data Structures Workshop",
    date: "June 5, 2025",
    time: "2:00 PM - 6:00 PM",
    location: "Online",
    type: "Workshop",
    description: "Master advanced data structures and algorithms with hands-on exercises.",
    url: "https://example.com/data-structures",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "AI Career Fair",
    date: "May 25, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "San Francisco, CA",
    type: "Career Fair",
    description: "Connect with top AI companies hiring engineers, researchers, and product managers.",
    url: "https://example.com/ai-career-fair",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2127&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Google Cloud Certification Workshop",
    date: "June 15, 2025",
    time: "9:00 AM - 1:00 PM",
    location: "Online",
    type: "Workshop",
    description: "Prepare for Google Cloud certification with expert-led training sessions.",
    url: "https://example.com/google-cloud-cert",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
  },
];

const EventCard = ({ event, onRegister }: { event: EventData, onRegister: (event: EventData) => void }) => {
  return (
    <div className="glass-card overflow-hidden group">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${event.image})` }}
      />
      <div className="p-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs bg-white/10 mb-3">
          {event.type}
        </span>
        <h3 className="text-xl font-semibold mb-2 group-hover:cosmic-text transition-all">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-white/70">
            <Calendar size={14} className="mr-2" />
            {event.date}
          </div>
          
          <div className="flex items-center text-sm text-white/70">
            <Clock size={14} className="mr-2" />
            {event.time}
          </div>
          
          <div className="flex items-center text-sm text-white/70">
            <MapPin size={14} className="mr-2" />
            {event.location}
          </div>
          
          {event.description && (
            <div className="text-sm text-white/70 mt-2">
              {event.description}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => onRegister(event)} 
            className="cosmic-gradient text-white w-full"
          >
            Register <ExternalLink className="ml-1" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();
  
  // Load user profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('careerProfileData');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as ProfileData;
        setUserProfile(profile);
      } catch (error) {
        console.error("Error parsing profile data:", error);
      }
    }
  }, []);
  
  // Extract skills from user profile for event recommendations
  const userSkills = userProfile?.targetRoles || [];
  const userGoals = userProfile?.goals || "";
  const userDreamJob = userProfile?.dreamJob;
  
  // Fetch personalized events based on user profile
  const { data: personalizedEvents, isLoading, error } = useQuery({
    queryKey: ['personalizedEvents', userSkills, userGoals, userDreamJob],
    queryFn: () => getRelevantEvents(userSkills, userGoals?.split('.') || [], userDreamJob),
    enabled: userSkills.length > 0 || !!userGoals,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  // Combine sample events and personalized events
  const allEvents = [...(personalizedEvents || []), ...SAMPLE_EVENTS];
  
  // Filter events by search query and tab
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && event.type.toLowerCase() === activeTab.toLowerCase();
  });
  
  const handleRegister = (event: EventData) => {
    // Open event registration URL in a new tab
    window.open(event.url, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Redirecting to event page",
      description: `You're being redirected to register for ${event.title}`,
    });
  };
  
  return (
    <PageLayout title="Events">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-white/50" />
              <Input 
                placeholder="Search events..." 
                className="pl-10 bg-white/5 border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" className="glass-button">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </Button>
            
            <Button variant="default" className="cosmic-gradient text-white">
              View Map
            </Button>
          </div>
        </div>
        
        {userProfile && (
          <div className="mb-8 glass-card p-4">
            <h2 className="text-xl font-medium mb-2 cosmic-text">Personalized Events</h2>
            <p className="text-white/70">
              {isLoading ? (
                "Finding events tailored to your career profile..."
              ) : personalizedEvents && personalizedEvents.length > 0 ? (
                `We've found ${personalizedEvents.length} events relevant to your skills and interests.`
              ) : (
                "Complete your career profile to get personalized event recommendations."
              )}
            </p>
          </div>
        )}
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="glass-card bg-white/5 p-1">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="conference">Conferences</TabsTrigger>
            <TabsTrigger value="workshop">Workshops</TabsTrigger>
            <TabsTrigger value="hackathon">Hackathons</TabsTrigger>
            <TabsTrigger value="webinar">Webinars</TabsTrigger>
            <TabsTrigger value="career fair">Career Fairs</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="glass-card h-96 animate-pulse">
                    <CardContent className="p-0">
                      <div className="h-48 bg-white/5"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-white/5 rounded w-1/4"></div>
                        <div className="h-6 bg-white/5 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-white/5 rounded"></div>
                          <div className="h-4 bg-white/5 rounded"></div>
                          <div className="h-4 bg-white/5 rounded"></div>
                        </div>
                        <div className="h-10 bg-white/5 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} onRegister={handleRegister} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No matching events found</h3>
                <p className="text-white/70 mb-4">Try changing your search or filters</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("all");
                  }}
                  variant="outline"
                  className="glass-button"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 text-center">
          <Button variant="outline" className="glass-button px-8">
            Load More Events
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Events;
