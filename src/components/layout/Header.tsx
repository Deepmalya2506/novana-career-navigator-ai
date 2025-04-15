import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
  Rocket,
  BookOpen,
  Calendar,
  Linkedin,
  MoonStar,
  Users,
  EyeOff,
  Menu,
  X,
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Career',
    href: '/career',
    icon: <Rocket className="mr-2 h-4 w-4" />,
    description: 'Personalized career roadmap for your dream company',
  },
  {
    name: 'Exam Prep',
    href: '/exam',
    icon: <BookOpen className="mr-2 h-4 w-4" />,
    description: 'AI-powered study plan based on your syllabus',
  },
  {
    name: 'Events',
    href: '/events',
    icon: <Calendar className="mr-2 h-4 w-4" />,
    description: 'Discover and register for relevant events',
  },
  {
    name: 'LinkedIn',
    href: '/linkedin',
    icon: <Linkedin className="mr-2 h-4 w-4" />,
    description: 'Generate engaging LinkedIn posts for your achievements',
  },
  {
    name: 'Night Owl',
    href: '/night-owl',
    icon: <MoonStar className="mr-2 h-4 w-4" />,
    description: 'AI companion for late-night study sessions',
  },
  {
    name: 'Community',
    href: '/community',
    icon: <Users className="mr-2 h-4 w-4" />,
    description: 'Connect with peers for resources and doubt solving',
  },
  {
    name: 'Proctored',
    href: '/proctored',
    icon: <EyeOff className="mr-2 h-4 w-4" />,
    description: 'Focus monitoring with ranks and badges',
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-card backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold animated-gradient-text">NOVANA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/10">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                    {navigationItems.map((item) => (
                      <ListItem
                        key={item.name}
                        title={item.name}
                        href={item.href}
                        icon={item.icon}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {navigationItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors flex items-center"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="border-white/10 hover:bg-white/10"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Login/Signup Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:border-white/40"
            size="sm"
          >
            Login
          </Button>
          <Button 
            className="cosmic-gradient text-white"
            size="sm"
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden glass-card backdrop-blur-xl px-4 py-5 absolute top-16 left-0 right-0 border-t border-white/10">
          <nav className="flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="flex space-x-3 pt-4 border-t border-white/10">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:border-white/40 flex-1"
                size="sm"
              >
                Login
              </Button>
              <Button 
                className="cosmic-gradient text-white flex-1"
                size="sm"
              >
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white",
            className
          )}
          {...props}
        >
          <div className="flex items-center">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-white/70">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
