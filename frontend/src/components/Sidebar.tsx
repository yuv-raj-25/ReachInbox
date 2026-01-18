import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Send, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";

interface SidebarProps {
  onCompose: () => void;
  activeTab: "scheduled" | "sent";
  onTabChange: (tab: "scheduled" | "sent") => void;
}

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

const Sidebar = ({ onCompose, activeTab, onTabChange }: SidebarProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    // Load user data from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }

    // Fetch email counts
    fetchEmailCounts();

    // Refresh counts every 30 seconds
    const interval = setInterval(fetchEmailCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmailCounts = async () => {
    try {
      // Fetch scheduled emails count
      const scheduledRes = await api.get('/api/emails/scheduled');
      setScheduledCount(scheduledRes.data.data?.length || 0);

      // Fetch sent emails count
      const sentRes = await api.get('/api/emails/sent');
      setSentCount(sentRes.data.data?.length || 0);
    } catch (err) {
      console.error('Failed to fetch email counts:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    navigate('/login');
  };

  // Generate initials from email or name
  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="w-[230px] h-full border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">DNB</h1>
      </div>

      {/* User Profile */}
      <div className="px-4 py-3 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.name || user?.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || 'No email'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex-shrink-0 p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </button>
      </div>

      {/* Compose Button */}
      <div className="px-3 py-4">
        <Button
          variant="outline"
          className="w-full h-10 border-primary text-primary hover:bg-primary/5 font-medium"
          onClick={onCompose}
        >
          Compose
        </Button>
      </div>

      {/* Navigation */}
      <div className="px-3">
        <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Core</p>
        
        <button
          onClick={() => onTabChange("scheduled")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
            activeTab === "scheduled"
              ? "bg-green-100 text-green-900 font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4" />
            <span>Scheduled</span>
          </div>
          <span className="text-xs text-muted-foreground">{scheduledCount}</span>
        </button>

        <button
          onClick={() => onTabChange("sent")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
            activeTab === "sent"
              ? "bg-green-100 text-green-900 font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <div className="flex items-center gap-3">
            <Send className="h-4 w-4" />
            <span>Sent</span>
          </div>
          <span className="text-xs text-muted-foreground">{sentCount}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;