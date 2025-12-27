import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  FolderKanban,
  Settings,
  ClipboardPlus,
  LogOut,
  Users,
  Search,
  SquareChartGantt,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Define types for better safety
type NavItem = {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Maintenance Calendar', href: '/maintenancecalender', icon: Calendar },
  { 
    name: 'Equipment', 
    href: '/equipment', 
    icon: Wrench,
    // Added sub-menus here
    children: [
      { name: 'Work Center', href: '/equipment/work-center' },
      { name: 'Machine & Tools', href: '/equipment/machines' },
    ]
  },
  { name: 'Reporting', href: '/reporting', icon: ClipboardPlus },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench }, // Changed icon and name
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Fetch profile for current user
  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      console.debug('[MainLayout] starting loadProfile, authToken:', localStorage.getItem('authToken'));
      try {
        let {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        console.debug('[MainLayout] supabase.auth.getUser()', { user, userErr });

        // If supabase client has no user but we have a stored token, set session
        if ((!user || !user.id) && localStorage.getItem('authToken')) {
          const token = localStorage.getItem('authToken') as string;
          try {
            await supabase.auth.setSession({ access_token: token, refresh_token: '' });
            const res = await supabase.auth.getUser();
            user = res.data.user;
            if (res.error) console.error('getUser after setSession error', res.error);
          } catch (setErr) {
            console.error('Error setting supabase session from authToken', setErr);
          }
        }

        if (userErr) {
          console.error('Getting supabase user error', userErr);
        }

        // If we have a user id, try loading their profile row
        if (user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

          console.debug('[MainLayout] profiles.select result', { data, error });

          if (error) {
            console.error('Error fetching profile', error);
          } else if (mounted) {
            setProfile(data as any);
            // cache for quick header display
            if (data?.full_name) localStorage.setItem('profileFullName', data.full_name);
          }
        } else {
          // No user from supabase client: fall back to cached profile in localStorage
          const cachedName = localStorage.getItem('profileFullName');
          console.debug('[MainLayout] no supabase user, using cached profile', { cachedName });
          if (mounted && cachedName) {
            setProfile({ full_name: cachedName });
          }
        }
      } catch (err) {
        console.error('Unexpected error loading profile', err);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, []);

  const handleLogout = () => {
    // sign out at supabase and clear local token
    supabase.auth.signOut().catch(() => {});
    localStorage.removeItem('authToken');
    localStorage.removeItem('profileFullName');
    localStorage.removeItem('profileEmail');
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6 gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-xl mr-4">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="hidden sm:block text-foreground">Gear Guard</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map(item => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

              // CHECK: Does this item have a dropdown?
              if (item.children) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                        <ChevronDown className="h-3 w-3 ml-0.5 opacity-50" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.name} asChild>
                          <Link 
                            to={child.href}
                            className="cursor-pointer w-full"
                          >
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              // STANDARD LINK (No Dropdown)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9 bg-muted/50 border-transparent focus:border-input focus:bg-background"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {(() => {
                        const name = profile?.full_name || localStorage.getItem('profileFullName');
                        if (name) return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
                        const em = profile?.email || localStorage.getItem('profileEmail');
                        return em ? em[0].toUpperCase() : 'U';
                      })()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">{profile?.full_name ?? localStorage.getItem('profileFullName') ?? 'Account'}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile?.full_name ?? localStorage.getItem('profileFullName') ?? 'Account'}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email ?? localStorage.getItem('profileEmail') ?? ''}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}