
import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Calendar, Clock, Filter, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Microsoft Developer Conference",
    date: "May 20, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Seattle, WA",
    type: "Conference",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Data Structures Workshop",
    date: "June 5, 2025",
    time: "2:00 PM - 6:00 PM",
    location: "Online",
    type: "Workshop",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "AI Career Fair",
    date: "May 25, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "San Francisco, CA",
    type: "Career Fair",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2127&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Google Cloud Certification Workshop",
    date: "June 15, 2025",
    time: "9:00 AM - 1:00 PM",
    location: "Online",
    type: "Workshop",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
  },
];

const EventCard = ({ event }: { event: typeof SAMPLE_EVENTS[0] }) => {
  const { toast } = useToast();
  
  const handleRegister = (id: number) => {
    toast({
      title: "Registration Successful",
      description: `You've been registered for ${event.title}`,
    });
  };
  
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
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => handleRegister(event.id)} 
            className="cosmic-gradient text-white w-full"
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredEvents = SAMPLE_EVENTS.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
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
