
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  School, 
  LogOut, 
  Bell, 
  Home,
  Users,
  CreditCard,
  MessageCircle,
  Calendar,
  BookOpen,
  FileText
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NavigationProps {
  user?: any;
  profile?: any;
  notifications?: any[];
}

const Navigation: React.FC<NavigationProps> = ({ user, profile, notifications = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur EcoleNet !",
      });
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/dashboard', icon: Users, label: 'Tableau de bord' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/schedule', icon: Calendar, label: 'Planning' },
    { path: '/courses', icon: BookOpen, label: 'Cours' },
    { path: '/documents', icon: FileText, label: 'Documents' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl">
              <School className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">EcoleNet</h1>
              <p className="text-sm text-slate-600">Espace Parent</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>
          
          {user && (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge className="ml-1 h-4 w-4 p-0 text-xs">{notifications.length}</Badge>
                )}
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>
                  {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-slate-500">{user.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
