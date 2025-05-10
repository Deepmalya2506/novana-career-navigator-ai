
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const UserMenu = () => {
  const { user, profile, signOut, isAuthenticated } = useAuth();
  
  // For anonymous users, show login and signup buttons
  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          className="border-white/20 text-white hover:border-white/40"
          size="sm"
          asChild
        >
          <Link to="/auth">Login</Link>
        </Button>
        <Button 
          className="cosmic-gradient text-white"
          size="sm"
          asChild
        >
          <Link to="/auth?tab=signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  // For authenticated users, show avatar dropdown
  const initials = profile?.first_name && profile?.last_name 
    ? `${profile.first_name[0]}${profile.last_name[0]}`
    : user?.email?.substring(0, 2).toUpperCase() || 'UN';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-white/20">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile?.first_name || 'User'} />
            ) : null}
            <AvatarFallback className="bg-primary/20 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
