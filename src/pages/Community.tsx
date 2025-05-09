import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import GlowBadge from '@/components/ui/GlowBadge';
import FloatingOrb from '@/components/ui/FloatingOrb';
import MoonPhaseDisplay from '@/components/nightowl/MoonPhaseDisplay';
import { useGemini } from '@/hooks/useGemini';

import { 
  Search, MessageSquare, Users, BookOpen, ThumbsUp, 
  MessageCircle, Share2, Bell, Globe, Rocket, 
  Lightbulb, GraduationCap, Yoga, Star, Badge as BadgeIcon, Plus
} from 'lucide-react';

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
  category?: string;
}

interface Group {
  id: number;
  name: string;
  members: number;
  description: string;
  image: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Member {
  id: number;
  name: string;
  avatar: string;
  points: number;
  badges: number;
  role: string;
}

// Sample data
const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    author: {
      name: "Alex Johnson",
      avatar: "",
      username: "alexj",
    },
    content: "Just completed my Microsoft Azure certification! The NOVANA roadmap really helped me prepare effectively.",
    time: "2 hours ago",
    likes: 24,
    comments: 5,
    shares: 2,
    category: "Career Launchpad"
  },
  {
    id: 2,
    author: {
      name: "Samantha Lee",
      avatar: "",
      username: "samlee",
    },
    content: "Looking for study partners for the upcoming Google Cloud certification. Anyone else preparing for it?",
    time: "5 hours ago",
    likes: 18,
    comments: 12,
    shares: 0,
    category: "Student Sanctuary"
  },
  {
    id: 3,
    author: {
      name: "Michael Reed",
      avatar: "",
      username: "mreed",
    },
    content: "Just pushed my first commit to the community project we started last week. Check it out: https://github.com/community/awesome-project",
    time: "Yesterday",
    likes: 45,
    comments: 8,
    shares: 10,
    category: "AI & Innovation"
  },
];

const SAMPLE_GROUPS: Group[] = [
  {
    id: 1,
    name: "Web Development Enthusiasts",
    members: 427,
    description: "For those passionate about front-end and back-end development.",
    image: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Data Science & Machine Learning",
    members: 358,
    description: "Discuss ML algorithms, data analysis, and AI applications.",
    image: "https://images.unsplash.com/photo-1527474305487-6c288c2a73b0?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Career Transition Support",
    members: 215,
    description: "Guidance and support for those switching careers into tech.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
  },
];

const SAMPLE_EVENTS: Event[] = [
  {
    id: "ev1",
    title: "TechConnect Hackathon",
    date: "June 15-17, 2025",
    location: "San Francisco, CA",
    type: "Hackathon",
    description: "48-hour coding challenge focusing on AI solutions for sustainability"
  },
  {
    id: "ev2",
    title: "Women in Tech Meetup",
    date: "May 25, 2025",
    location: "Virtual",
    type: "Networking",
    description: "Monthly gathering for women in technology to connect and share experiences"
  },
  {
    id: "ev3",
    title: "Frontend Development Workshop",
    date: "June 2, 2025",
    location: "New York, NY",
    type: "Workshop",
    description: "Hands-on workshop covering the latest frontend frameworks and techniques"
  }
];

const SAMPLE_BADGES: Badge[] = [
  {
    id: 1,
    name: "Stellar Starter",
    description: "Awarded to new members who make 5+ valuable contributions in their first month",
    icon: "star",
    color: "blue"
  },
  {
    id: 2,
    name: "Orbit Influencer",
    description: "Recognizes members whose posts consistently receive high engagement",
    icon: "users",
    color: "purple"
  },
  {
    id: 3,
    name: "Night Owl Contributor",
    description: "For dedicated members who are active during late hours, supporting the global community",
    icon: "moon",
    color: "pink"
  }
];

const TOP_MEMBERS: Member[] = [
  {
    id: 1,
    name: "Jessica Wang",
    avatar: "",
    points: 1250,
    badges: 7,
    role: "AI Research Lead"
  },
  {
    id: 2,
    name: "David Kim",
    avatar: "",
    points: 1105,
    badges: 5,
    role: "Frontend Developer"
  },
  {
    id: 3,
    name: "Priya Patel",
    avatar: "",
    points: 980,
    badges: 6,
    role: "Data Scientist"
  }
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "New Career Path: Cybersecurity Analyst",
    category: "Product Releases",
    date: "May 5, 2025"
  },
  {
    id: 2,
    title: "Virtual Career Fair - Register Now",
    category: "Events",
    date: "May 12, 2025"
  },
  {
    id: 3,
    title: "Open Source Contribution Week Starts Monday",
    category: "Opportunities",
    date: "May 19, 2025"
  }
];

const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-start">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback className="bg-novana-blue/30">{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{post.author.name}</h4>
              <p className="text-sm text-white/60">@{post.author.username} • {post.time}</p>
            </div>
            {post.category && (
              <GlowBadge color={
                post.category === "Career Launchpad" ? "blue" : 
                post.category === "AI & Innovation" ? "purple" : 
                post.category === "Student Sanctuary" ? "green" :
                post.category === "Wellness & Night Owl" ? "pink" : "orange"
              }>
                {post.category}
              </GlowBadge>
            )}
          </div>
          
          <p className="mt-3">{post.content}</p>
          
          <div className="flex items-center mt-4 pt-4 border-t border-white/10 space-x-6">
            <button className="flex items-center text-white/70 hover:text-white hover:scale-105 transition-all">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{post.likes}</span>
            </button>
            
            <button className="flex items-center text-white/70 hover:text-white hover:scale-105 transition-all">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{post.comments}</span>
            </button>
            
            <button className="flex items-center text-white/70 hover:text-white hover:scale-105 transition-all">
              <Share2 className="h-4 w-4 mr-1" />
              <span>{post.shares}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroupCard = ({ group }: { group: Group }) => {
  return (
    <div className="glass-card overflow-hidden group animate-fade-in hover:border-white/30 transition-all duration-300">
      <div 
        className="h-32 bg-cover bg-center" 
        style={{ backgroundImage: `url(${group.image})` }}
      />
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
        <p className="text-sm text-white/70 mb-3">{group.members} members</p>
        <p className="text-sm mb-4">{group.description}</p>
        
        <Button className="w-full glass-button hover:bg-white/30 hover:scale-105 transition-all">
          <Users className="h-4 w-4 mr-2" />
          Join Group
        </Button>
      </div>
    </div>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="glass-card p-4 hover:border-white/30 transition-all duration-300 animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-full bg-novana-purple/20 text-novana-light-blue">
          {event.type === "Hackathon" ? (
            <Globe className="h-8 w-8" />
          ) : event.type === "Workshop" ? (
            <GraduationCap className="h-8 w-8" />
          ) : (
            <Users className="h-8 w-8" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-lg">{event.title}</h4>
          <div className="flex items-center text-sm text-white/70 mt-1">
            <span className="mr-3">{event.date}</span>
            <span>{event.location}</span>
          </div>
          <p className="mt-2 text-sm">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

const SpotlightSection = () => {
  const [currentSpotlight, setCurrentSpotlight] = useState(0);
  const spotlights = [
    {
      title: "Member of the Week",
      name: "Aisha Johnson",
      description: "Aisha has helped 15+ community members solve challenging coding problems this week!",
      image: ""
    },
    {
      title: "Inspiring Project",
      name: "EcoTech Analyzer",
      description: "An open-source project started by our members that uses AI to analyze environmental data.",
      image: ""
    },
    {
      title: "Daily Quote",
      quote: "In this galaxy, you never grow alone. Your journey shapes our collective universe.",
      author: "NOVANA Community"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpotlight((prev) => (prev + 1) % spotlights.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const spotlight = spotlights[currentSpotlight];
  
  return (
    <Card className="glass-card overflow-hidden relative animate-pulse-glow">
      <div className="absolute inset-0 bg-gradient-to-r from-novana-blue/10 via-novana-purple/10 to-novana-pink/10 animate-pulse-glow"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-5 w-5 text-novana-light-blue" />
          <h3 className="text-lg font-semibold">Spotlight: {spotlight.title}</h3>
        </div>
        
        {spotlight.title === "Daily Quote" ? (
          <div className="py-4">
            <p className="text-lg italic text-center">"{spotlight.quote}"</p>
            <p className="text-sm text-right mt-2 text-white/70">— {spotlight.author}</p>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-novana-purple/20">{spotlight.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{spotlight.name}</h4>
              <p className="text-sm mt-1">{spotlight.description}</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-center mt-4 space-x-2">
          {spotlights.map((_, index) => (
            <button 
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentSpotlight ? 'bg-novana-light-blue' : 'bg-white/20'}`}
              onClick={() => setCurrentSpotlight(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>("Events");
  const { askQuestion } = useGemini();
  const [isJoining, setIsJoining] = useState(false);
  
  return (
    <PageLayout>
      {/* Hero Section with Joining Orbit */}
      <section className="relative overflow-hidden py-32 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0"></div>
        
        {/* Animated Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <FloatingOrb size="lg" className="absolute top-20 left-20 opacity-30" />
          <FloatingOrb size="md" className="absolute bottom-20 right-20 opacity-20" color="from-novana-purple to-novana-pink" />
          <FloatingOrb size="sm" className="absolute top-40 right-40 opacity-15" color="from-novana-pink to-novana-light-blue" />
          
          {/* Orbiting Avatars */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80">
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const x = Math.cos(angle) * 150;
              const y = Math.sin(angle) * 150;
              const delay = i * 0.5;
              
              return (
                <div 
                  key={i}
                  className="absolute rounded-full h-12 w-12 animate-float"
                  style={{
                    transform: `translateX(${x}px) translateY(${y}px)`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  <Avatar className="border-2 border-white/30">
                    <AvatarFallback className="bg-novana-purple/20">{String.fromCharCode(65 + i)}</AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
            
            {/* Central Planet */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-novana-blue via-novana-purple to-novana-pink animate-pulse-glow"></div>
            </div>
          </div>
        </div>
        
        <div className="container relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 cosmic-text animate-fade-in">
            In this galaxy, you never grow alone.
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto animate-fade-in">
            Join the NOVANA community — where ambition meets empathy, and users feel seen, celebrated, and connected.
          </p>
          
          <Button 
            className="cosmic-gradient text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl animate-float"
            onClick={() => setIsJoining(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Join Our Orbit
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Announcement Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3">
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-novana-light-blue animate-pulse-glow" />
                  <h3 className="text-xl font-semibold">Announcements</h3>
                </div>
                <div className="relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-novana-pink animate-pulse-glow"></div>
                  <Bell className="h-6 w-6 text-white cursor-pointer hover:text-novana-light-blue transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2">
                {["Events", "Product Releases", "Opportunities"].map((category) => (
                  <div key={category} className="glass-card border-white/5 overflow-hidden">
                    <div 
                      className="p-3 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedAnnouncement(expandedAnnouncement === category ? null : category)}
                    >
                      <h4 className="font-medium">{category}</h4>
                      <span className={`transform transition-transform ${expandedAnnouncement === category ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                    
                    {expandedAnnouncement === category && (
                      <div className="p-3 border-t border-white/5 bg-white/5 animate-fade-in">
                        {ANNOUNCEMENTS
                          .filter(a => a.category === category)
                          .map(announcement => (
                            <div key={announcement.id} className="py-2">
                              <p>{announcement.title}</p>
                              <p className="text-xs text-white/60">{announcement.date}</p>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Search and tabs */}
            <div className="mb-8 flex justify-between items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                <Input 
                  placeholder="Search in community..." 
                  className="pl-10 bg-white/5 border-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button className="cosmic-gradient text-white">
                Create Post
              </Button>
            </div>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue="feed" className="w-full mb-8">
                <TabsList className="glass-card p-1 w-full">
                  <TabsTrigger value="feed" className="data-[state=active]:bg-white/20 px-6 py-2">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Feed
                  </TabsTrigger>
                  <TabsTrigger value="discussions" className="data-[state=active]:bg-white/20 px-6 py-2">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Discussions
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="data-[state=active]:bg-white/20 px-6 py-2">
                    <Users className="mr-2 h-5 w-5" />
                    Groups
                  </TabsTrigger>
                  <TabsTrigger value="events" className="data-[state=active]:bg-white/20 px-6 py-2">
                    <Globe className="mr-2 h-5 w-5" />
                    Events
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="feed" className="space-y-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <Input 
                        placeholder="Share something with the community..." 
                        className="bg-white/5 border-white/20"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div className="flex space-x-4">
                        <Button variant="outline" size="sm" className="glass-button text-sm">
                          <Rocket className="mr-1 h-4 w-4" />
                          Career
                        </Button>
                        <Button variant="outline" size="sm" className="glass-button text-sm">
                          <Lightbulb className="mr-1 h-4 w-4" />
                          Innovation
                        </Button>
                        <Button variant="outline" size="sm" className="glass-button text-sm">
                          <GraduationCap className="mr-1 h-4 w-4" />
                          Education
                        </Button>
                      </div>
                      
                      <Button className="cosmic-gradient text-white text-sm">
                        Post
                      </Button>
                    </div>
                  </div>
                  
                  {/* Forum Channels */}
                  <div className="flex items-center space-x-4 overflow-x-auto py-2 px-1">
                    <Button variant="outline" size="sm" className="glass-button whitespace-nowrap">
                      <Rocket className="mr-2 h-4 w-4" />
                      Career Launchpad
                    </Button>
                    <Button variant="outline" size="sm" className="glass-button whitespace-nowrap">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      AI & Innovation
                    </Button>
                    <Button variant="outline" size="sm" className="glass-button whitespace-nowrap">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Student Sanctuary
                    </Button>
                    <Button variant="outline" size="sm" className="glass-button whitespace-nowrap">
                      <Star className="mr-2 h-4 w-4" />
                      Wellness & Night Owl
                    </Button>
                    <Button variant="outline" size="sm" className="glass-button whitespace-nowrap">
                      <Globe className="mr-2 h-4 w-4" />
                      Hackathons & Events
                    </Button>
                  </div>
                  
                  {SAMPLE_POSTS.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </TabsContent>
                
                <TabsContent value="discussions" className="space-y-6">
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Hot Topics</h3>
                    <ul className="space-y-4">
                      <li>
                        <a href="#" className="block hover:bg-white/5 p-3 rounded-md transition-colors">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Best resources for learning system design?</h4>
                            <Badge variant="outline" className="bg-novana-purple/20">Career</Badge>
                          </div>
                          <p className="text-sm text-white/70 mt-1">23 replies • 3 days ago</p>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="block hover:bg-white/5 p-3 rounded-md transition-colors">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">How to prepare for Google's behavioral interviews?</h4>
                            <Badge variant="outline" className="bg-novana-blue/20">Interview</Badge>
                          </div>
                          <p className="text-sm text-white/70 mt-1">45 replies • 1 week ago</p>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="block hover:bg-white/5 p-3 rounded-md transition-colors">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Share your career transition success stories</h4>
                            <Badge variant="outline" className="bg-novana-pink/20">Stories</Badge>
                          </div>
                          <p className="text-sm text-white/70 mt-1">56 replies • 2 weeks ago</p>
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <Button className="w-full glass-button">
                    Start a New Discussion
                  </Button>
                </TabsContent>
                
                <TabsContent value="groups" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SAMPLE_GROUPS.map(group => (
                    <GroupCard key={group.id} group={group} />
                  ))}
                  
                  <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                    <Users className="h-12 w-12 mb-3 text-white/70" />
                    <h3 className="text-lg font-semibold mb-1">Create New Group</h3>
                    <p className="text-sm text-white/70 mb-4">Start a community around your interests</p>
                    <Button className="cosmic-gradient text-white">
                      Create Group
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="events" className="space-y-6">
                  <div className="glass-card p-6 mb-4">
                    <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
                    <div className="mb-4">
                      <Button variant="outline" size="sm" className="mr-2 glass-button">
                        All Events
                      </Button>
                      <Button variant="outline" size="sm" className="glass-button">
                        Only show relevant to me
                      </Button>
                    </div>
                    
                    {/* Events Map Placeholder */}
                    <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-novana-blue/30 to-novana-purple/30"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-lg">Interactive Map Coming Soon</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {SAMPLE_EVENTS.map(event => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Real-time clock */}
            <MoonPhaseDisplay />
            
            {/* Spotlight Section */}
            <SpotlightSection />
            
            {/* Profile Section */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
              
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarFallback className="bg-novana-purple/20">U</AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className="font-medium">Username</h4>
                  <p className="text-sm text-white/70">@username</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 text-center py-3 border-y border-white/10 my-4">
                <div>
                  <p className="font-medium">5</p>
                  <p className="text-sm text-white/70">Posts</p>
                </div>
                <div>
                  <p className="font-medium">142</p>
                  <p className="text-sm text-white/70">Connections</p>
                </div>
                <div>
                  <p className="font-medium">3</p>
                  <p className="text-sm text-white/70">Groups</p>
                </div>
              </div>
              
              <Button className="w-full glass-button">
                Edit Profile
              </Button>
            </div>
            
            {/* Badges Section */}
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <BadgeIcon className="h-5 w-5 mr-2 text-novana-light-blue" />
                <h3 className="text-lg font-semibold">Cosmic Profile Badges</h3>
              </div>
              
              <div className="space-y-3">
                {SAMPLE_BADGES.map(badge => (
                  <div key={badge.id} className="flex items-center p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 bg-${badge.color === 'blue' ? 'novana-blue' : badge.color === 'purple' ? 'novana-purple' : 'novana-pink'}/20`}>
                      {badge.icon === 'star' ? (
                        <Star className="h-5 w-5 text-novana-light-blue" />
                      ) : badge.icon === 'users' ? (
                        <Users className="h-5 w-5 text-novana-purple" />
                      ) : (
                        <Star className="h-5 w-5 text-novana-pink" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-white/70">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="font-medium mb-2">Weekly Top Contributors</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Badges</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TOP_MEMBERS.map(member => (
                      <TableRow key={member.id}>
                        <TableCell className="py-2">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="text-xs bg-novana-purple/20">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{member.points}</TableCell>
                        <TableCell className="text-sm">{member.badges}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Community;
