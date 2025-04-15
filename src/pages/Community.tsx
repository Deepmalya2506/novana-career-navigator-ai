
import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageSquare, Users, BookOpen, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

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
}

interface Group {
  id: number;
  name: string;
  members: number;
  description: string;
  image: string;
}

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

const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{post.author.name}</h4>
              <p className="text-sm text-white/60">@{post.author.username} • {post.time}</p>
            </div>
          </div>
          
          <p className="mt-3">{post.content}</p>
          
          <div className="flex items-center mt-4 pt-4 border-t border-white/10 space-x-6">
            <button className="flex items-center text-white/70 hover:text-white">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{post.likes}</span>
            </button>
            
            <button className="flex items-center text-white/70 hover:text-white">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{post.comments}</span>
            </button>
            
            <button className="flex items-center text-white/70 hover:text-white">
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
    <div className="glass-card overflow-hidden group">
      <div 
        className="h-32 bg-cover bg-center" 
        style={{ backgroundImage: `url(${group.image})` }}
      />
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
        <p className="text-sm text-white/70 mb-3">{group.members} members</p>
        <p className="text-sm mb-4">{group.description}</p>
        
        <Button className="w-full glass-button hover:bg-white/30">
          Join Group
        </Button>
      </div>
    </div>
  );
};

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <PageLayout title="Community">
      <div className="container mx-auto px-4 py-12">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
                        <h4 className="font-medium">Best resources for learning system design?</h4>
                        <p className="text-sm text-white/70">23 replies • 3 days ago</p>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block hover:bg-white/5 p-3 rounded-md transition-colors">
                        <h4 className="font-medium">How to prepare for Google's behavioral interviews?</h4>
                        <p className="text-sm text-white/70">45 replies • 1 week ago</p>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block hover:bg-white/5 p-3 rounded-md transition-colors">
                        <h4 className="font-medium">Share your career transition success stories</h4>
                        <p className="text-sm text-white/70">56 replies • 2 weeks ago</p>
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
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
              
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
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
              
              <Button className="w-full glass-button">
                Edit Profile
              </Button>
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
