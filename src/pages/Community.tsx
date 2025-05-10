
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';
import { useGemini } from '@/hooks/useGemini';
import { toast } from 'sonner';
import {
  Search,
  MessageSquare,
  Users,
  BookOpen,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bell,
  Star,
  Rocket,
  LightbulbIcon,
  GraduationCap,
  Yoga,
  Globe,
  TrendingUp,
  MapPin,
  Calendar,
} from 'lucide-react';

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    username: string;
    badge?: string;
  };
  content: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
  tags?: string[];
}

interface Group {
  id: number;
  name: string;
  members: number;
  description: string;
  image: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  type: string;
  coordinates: { lat: number; lng: number };
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'event' | 'release' | 'opportunity';
  date: string;
}

interface SpotlightStory {
  id: number;
  type: 'member' | 'project' | 'quote';
  title: string;
  content: string;
  author?: string;
  image?: string;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    author: {
      name: "Alex Johnson",
      avatar: "",
      username: "alexj",
      badge: "Stellar Starter"
    },
    content: "Just completed my Microsoft Azure certification! The NOVANA roadmap really helped me prepare effectively.",
    time: "2 hours ago",
    likes: 24,
    comments: 5,
    shares: 2,
    tags: ["certification", "azure", "success"]
  },
  {
    id: 2,
    author: {
      name: "Samantha Lee",
      avatar: "",
      username: "samlee",
      badge: "Orbit Influencer"
    },
    content: "Looking for study partners for the upcoming Google Cloud certification. Anyone else preparing for it?",
    time: "5 hours ago",
    likes: 18,
    comments: 12,
    shares: 0,
    tags: ["study-group", "google-cloud"]
  },
  {
    id: 3,
    author: {
      name: "Michael Reed",
      avatar: "",
      username: "mreed",
      badge: "Night Owl Contributor"
    },
    content: "Just pushed my first commit to the community project we started last week. Check it out: https://github.com/community/awesome-project",
    time: "Yesterday",
    likes: 45,
    comments: 8,
    shares: 10,
    tags: ["open-source", "project"]
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

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Virtual Hackathon Next Month",
    content: "Join our upcoming 48-hour virtual hackathon with prizes worth $10,000!",
    type: "event",
    date: "2025-06-15"
  },
  {
    id: 2,
    title: "NOVANA Mobile App Released",
    content: "Our mobile companion app is now available for download on iOS and Android.",
    type: "release",
    date: "2025-05-05"
  },
  {
    id: 3,
    title: "Mentorship Program Opening",
    content: "Apply to become a mentor or mentee in our 3-month structured program.",
    type: "opportunity",
    date: "2025-05-20"
  }
];

const SAMPLE_SPOTLIGHT: SpotlightStory[] = [
  {
    id: 1,
    type: "member",
    title: "Member of the Week: Priya Sharma",
    content: "From bootcamp graduate to Senior Developer at Google in 2 years. Priya attributes her success to consistent learning and community support.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
  },
  {
    id: 2,
    type: "project",
    title: "App That Helps Seniors Learn Tech",
    content: "Community members collaborated to create an accessible app that's helping seniors learn modern technology at their own pace.",
    author: "Tech for All Team",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    type: "quote",
    title: "Thought for Today",
    content: ""The stars don't look bigger, but they do look brighter." — Sally Ride, on seeing the Earth from space",
    author: "Shared by Night Owl Study Group"
  }
];

const SAMPLE_EVENTS: Event[] = [
  {
    id: 1,
    name: "Tech Conference 2025",
    date: "June 15, 2025",
    location: "San Francisco, CA",
    type: "Conference",
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: 2,
    name: "Local Python Meetup",
    date: "May 20, 2025",
    location: "New York, NY",
    type: "Meetup",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 3,
    name: "Women in Tech Workshop",
    date: "May 25, 2025",
    location: "Austin, TX",
    type: "Workshop",
    coordinates: { lat: 30.2672, lng: -97.7431 }
  }
];

const LEADERBOARD = [
  { name: "Jamie Smith", points: 1250, badge: "Orbit Influencer" },
  { name: "Raj Patel", points: 980, badge: "Night Owl Contributor" },
  { name: "Maria Garcia", points: 845, badge: "Stellar Starter" },
  { name: "David Lee", points: 720, badge: "Event Navigator" },
  { name: "Emma Wilson", points: 690, badge: "Stellar Starter" }
];

const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="glass-card p-6 hover:border-white/30 transition-all duration-300">
      <div className="flex items-start">
        <Avatar className="h-10 w-10 mr-3 ring-2 ring-white/20">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{post.author.name}</h4>
                {post.author.badge && (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Badge
                        variant="outline"
                        className="bg-gradient-to-r from-novana-blue to-novana-light-blue text-xs py-0 h-5"
                      >
                        {post.author.badge}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="glass-card border-white/20">
                      <p className="text-sm">
                        This badge represents {post.author.badge === 'Stellar Starter' 
                          ? 'an engaged new community member' 
                          : post.author.badge === 'Orbit Influencer' 
                            ? 'a highly influential community contributor'
                            : 'someone who actively participates in Night Owl sessions'
                        }
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
              <p className="text-sm text-white/60">@{post.author.username} • {post.time}</p>
            </div>
          </div>
          
          <p className="mt-3">{post.content}</p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-white/5 text-white/80 text-xs"># {tag}</Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center mt-4 pt-4 border-t border-white/10 space-x-6">
            <button className="flex items-center text-white/70 hover:text-white transition-colors">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{post.likes}</span>
            </button>
            
            <button className="flex items-center text-white/70 hover:text-white transition-colors">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{post.comments}</span>
            </button>
            
            <button className="flex items-center text-white/70 hover:text-white transition-colors">
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
    <div className="glass-card overflow-hidden group hover:border-white/30 transition-all duration-300">
      <div 
        className="h-32 bg-cover bg-center" 
        style={{ backgroundImage: `url(${group.image})` }}
      />
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
        <p className="text-sm text-white/70 mb-3">{group.members} members</p>
        <p className="text-sm mb-4">{group.description}</p>
        
        <Button className="w-full glass-button hover:bg-white/30 transition-all duration-300">
          Join Group
        </Button>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
  const iconMap = {
    event: <Calendar className="h-5 w-5 text-novana-light-blue" />,
    release: <Star className="h-5 w-5 text-novana-pink" />,
    opportunity: <Rocket className="h-5 w-5 text-novana-purple" />
  };

  return (
    <div className="flex gap-3 p-4 hover:bg-white/5 rounded-lg transition-colors">
      <div className="mt-1">
        {iconMap[announcement.type]}
      </div>
      <div>
        <h4 className="font-medium text-sm">{announcement.title}</h4>
        <p className="text-xs text-white/70">{announcement.content}</p>
      </div>
    </div>
  );
};

const SpotlightCard = ({ story, active }: { story: SpotlightStory; active: boolean }) => {
  const iconMap = {
    member: <Users className="h-5 w-5" />,
    project: <Rocket className="h-5 w-5" />,
    quote: <MessageSquare className="h-5 w-5" />
  };

  return (
    <div className={`rounded-xl overflow-hidden h-full transition-all duration-500 ${
      active ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
    }`}>
      {story.image ? (
        <div className="relative h-44 sm:h-60">
          <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              {iconMap[story.type]}
              <span className="text-xs uppercase tracking-wider text-white/70">{story.type}</span>
            </div>
            <h3 className="text-lg font-bold">{story.title}</h3>
          </div>
        </div>
      ) : (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-3">
            {iconMap[story.type]}
            <span className="text-xs uppercase tracking-wider text-white/70">{story.type}</span>
          </div>
          <h3 className="text-lg font-bold mb-2">{story.title}</h3>
          <p className="text-white/80">{story.content}</p>
          {story.author && (
            <p className="text-sm text-white/60 mt-2">— {story.author}</p>
          )}
        </div>
      )}
    </div>
  );
};

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [announcementsOpen, setAnnouncementsOpen] = useState(true);
  const [showRelevantOnly, setShowRelevantOnly] = useState(false);
  const { askQuestion } = useGemini();
  
  // Auto-rotate spotlight stories
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % SAMPLE_SPOTLIGHT.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handlePostSuggestion = async () => {
    try {
      toast.loading("Getting AI suggestions...");
      
      const response = await askQuestion(
        "Suggest a short professional post for a tech community about learning and growth mindset, less than 50 words."
      );
      
      if (response.text) {
        toast.dismiss();
        toast.success("Suggestion generated!");
        toast.info(response.text);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to get suggestion");
    }
  };
  
  return (
    <PageLayout
      title="Community"
      description="Join the NOVANA community to learn, share, and grow together"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 -right-64 w-[600px] h-[600px] bg-novana-purple/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-novana-blue/20 rounded-full blur-[100px]" />
      </div>

      <section className="container mx-auto px-4 py-6 mb-12">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 z-0">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-novana-purple/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-novana-blue/30 rounded-full blur-[80px]" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 cosmic-text">In this galaxy, you never grow alone.</h2>
            <p className="text-white/80 mb-6">
              Join thousands of ambitious learners, career transitioners, and tech enthusiasts in a supportive community that helps you reach your goals faster.
            </p>
            
            <Button className="cosmic-gradient text-white px-8 py-6 rounded-full text-lg font-medium hover:shadow-[0_0_15px_rgba(107,208,255,0.5)] transition-all duration-300">
              <Users className="mr-2 h-5 w-5" />
              Join Our Community
            </Button>
            
            <div className="flex mt-10">
              <div className="relative w-28 h-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Avatar key={i} className={`absolute h-8 w-8 border-2 border-background`} style={{ left: `${i * 16}px` }}>
                    <AvatarFallback className="bg-gradient-to-br from-novana-purple to-novana-blue">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="text-sm text-white/70 ml-2">
                <span className="text-white font-medium">120+</span> members joined this week
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-white/50" />
            <Input 
              placeholder="Search in community..." 
              className="pl-10 bg-white/5 border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="glass-button hover:bg-white/20 gap-2">
                  <Bell className="h-5 w-5 text-novana-light-blue animate-pulse-glow" />
                  <span className="hidden sm:inline">Announcements</span>
                  <Badge className="bg-novana-pink ml-1">3</Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="glass-card border-white/20 w-[320px]" align="end">
                <h4 className="text-sm font-medium mb-2">Recent Announcements</h4>
                <Collapsible
                  open={announcementsOpen}
                  onOpenChange={setAnnouncementsOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center justify-between w-full mb-2">
                      <span>All Updates</span>
                      {announcementsOpen ? "−" : "+"}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    {SAMPLE_ANNOUNCEMENTS.map(announcement => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </PopoverContent>
            </Popover>
            
            <Button className="cosmic-gradient text-white">
              Create Post
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Spotlight</h3>
              <div className="relative h-[300px]">
                {SAMPLE_SPOTLIGHT.map((story, index) => (
                  <SpotlightCard 
                    key={story.id} 
                    story={story} 
                    active={index === spotlightIndex} 
                  />
                ))}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {SAMPLE_SPOTLIGHT.map((_, index) => (
                    <button 
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === spotlightIndex 
                          ? 'bg-white w-4' 
                          : 'bg-white/40'
                      }`}
                      onClick={() => setSpotlightIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          
            <Tabs defaultValue="feed" className="w-full mb-8">
              <TabsList className="glass-card p-1">
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
                  <MapPin className="mr-2 h-5 w-5" />
                  Events
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="feed" className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3 ring-2 ring-white/10">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <Input 
                      placeholder="Share something with the community..." 
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="text-xs" onClick={handlePostSuggestion}>
                      <LightbulbIcon className="h-4 w-4 mr-1" />
                      AI Suggest
                    </Button>
                  </div>
                </div>
                
                {SAMPLE_POSTS.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
              
              <TabsContent value="discussions" className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Channel Topics</h3>
                    <Button variant="outline" size="sm" className="text-xs">New Topic</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="glass-card p-4 hover:border-novana-purple/50 cursor-pointer transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <Rocket className="h-5 w-5 text-novana-purple" />
                        <span className="font-semibold">Career Launchpad</span>
                      </div>
                      <p className="text-sm text-white/70">Resume reviews, interview prep, and career guidance</p>
                    </div>
                    
                    <div className="glass-card p-4 hover:border-novana-blue/50 cursor-pointer transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <LightbulbIcon className="h-5 w-5 text-novana-blue" />
                        <span className="font-semibold">AI & Innovation</span>
                      </div>
                      <p className="text-sm text-white/70">Discuss AI tools, innovations and future tech</p>
                    </div>
                    
                    <div className="glass-card p-4 hover:border-novana-light-blue/50 cursor-pointer transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="h-5 w-5 text-novana-light-blue" />
                        <span className="font-semibold">Student Sanctuary</span>
                      </div>
                      <p className="text-sm text-white/70">Academic support, study groups and resources</p>
                    </div>
                    
                    <div className="glass-card p-4 hover:border-novana-pink/50 cursor-pointer transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <Yoga className="h-5 w-5 text-novana-pink" />
                        <span className="font-semibold">Wellness & Night Owl Reflections</span>
                      </div>
                      <p className="text-sm text-white/70">Self-care tips, focus techniques, and night owl support</p>
                    </div>
                    
                    <div className="glass-card p-4 hover:border-white/30 cursor-pointer transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="h-5 w-5 text-white" />
                        <span className="font-semibold">Hackathons & Events</span>
                      </div>
                      <p className="text-sm text-white/70">Find local and online events, share experiences</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Hot Topics</h3>
                  <ul className="space-y-4">
                    <li>
                      <a href="#" className="block hover:bg-white/5 p-3 rounded-md transition-colors">
                        <h4 className="font-medium">Best resources for learning system design?</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-white/70">23 replies • 3 days ago</p>
                          <Badge variant="outline" className="bg-white/5">Career Launchpad</Badge>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block hover:bg-white/5 p-3 rounded-md transition-colors">
                        <h4 className="font-medium">How to prepare for Google's behavioral interviews?</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-white/70">45 replies • 1 week ago</p>
                          <Badge variant="outline" className="bg-white/5">Career Launchpad</Badge>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block hover:bg-white/5 p-3 rounded-md transition-colors">
                        <h4 className="font-medium">Share your career transition success stories</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-white/70">56 replies • 2 weeks ago</p>
                          <Badge variant="outline" className="bg-white/5">Student Sanctuary</Badge>
                        </div>
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
                
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center hover:border-white/30 transition-all duration-300">
                  <Users className="h-12 w-12 mb-3 text-white/70" />
                  <h3 className="text-lg font-semibold mb-1">Create New Group</h3>
                  <p className="text-sm text-white/70 mb-4">Start a community around your interests</p>
                  <Button className="cosmic-gradient text-white">
                    Create Group
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Events Near You</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/70">Only show relevant to me</span>
                      <input 
                        type="checkbox" 
                        className="toggle-checkbox" 
                        checked={showRelevantOnly}
                        onChange={() => setShowRelevantOnly(!showRelevantOnly)}
                      />
                    </div>
                  </div>
                  
                  <div className="glass-card border-novana-blue/20 h-[250px] relative mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white/50">Interactive map will be displayed here</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {SAMPLE_EVENTS.map(event => (
                      <div key={event.id} className="glass-card p-4 hover:border-white/30 cursor-pointer transition-all">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{event.name}</h4>
                            <div className="flex items-center text-sm text-white/70 mt-1 gap-2">
                              <Calendar className="h-4 w-4" /> {event.date}
                            </div>
                            <div className="flex items-center text-sm text-white/70 mt-1 gap-2">
                              <MapPin className="h-4 w-4" /> {event.location}
                            </div>
                          </div>
                          <Badge className="bg-white/10 self-start h-6">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
              
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4 ring-2 ring-white/20">
                  <AvatarFallback>U</AvatarFallback>
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
              
              <Button className="w-full glass-button hover:bg-white/20 transition-colors">
                Edit Profile
              </Button>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Leaderboard</h3>
                <Badge className="bg-novana-purple animate-pulse-glow">Weekly</Badge>
              </div>
              
              <ul className="space-y-3">
                {LEADERBOARD.map((user, index) => (
                  <li key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center font-bold ${
                        index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-300' : 
                        index === 2 ? 'text-amber-700' : ''
                      }`}>
                        {index + 1}
                      </span>
                      <span>{user.name}</span>
                      <Badge 
                        variant="outline" 
                        className="bg-white/5 text-xs ml-2"
                      >
                        {user.badge}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{user.points}</span>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Trending Topics</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-novana-light-blue hover:underline">#CareerTransition</a>
                  <p className="text-sm text-white/70">245 posts</p>
                </li>
                <li>
                  <a href="#" className="text-novana-light-blue hover:underline">#TechInterview</a>
                  <p className="text-sm text-white/70">189 posts</p>
                </li>
                <li>
                  <a href="#" className="text-novana-light-blue hover:underline">#StudyMotivation</a>
                  <p className="text-sm text-white/70">132 posts</p>
                </li>
              </ul>
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Suggested Connections</h3>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Jane Doe</p>
                      <p className="text-xs text-white/70">Data Scientist</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="glass-button text-xs h-8">
                    Connect
                  </Button>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-xs text-white/70">Backend Developer</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="glass-button text-xs h-8">
                    Connect
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Community;
