import { Clock, Send, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  onCompose: () => void;
  activeTab: "scheduled" | "sent";
  onTabChange: (tab: "scheduled" | "sent") => void;
}

const Sidebar = ({ onCompose, activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className="w-[230px] h-full border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">DNB</h1>
      </div>

      {/* User Profile */}
      <div className="px-4 py-3 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
          <AvatarFallback>OB</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">Oliver Brown</p>
          <p className="text-xs text-muted-foreground truncate">oliver.brown@domain.io</p>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
              ? "bg-sidebar-accent text-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4" />
            <span>Scheduled</span>
          </div>
          <span className="text-xs text-muted-foreground">12</span>
        </button>

        <button
          onClick={() => onTabChange("sent")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
            activeTab === "sent"
              ? "bg-sidebar-accent text-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
        >
          <div className="flex items-center gap-3">
            <Send className="h-4 w-4" />
            <span>Sent</span>
          </div>
          <span className="text-xs text-muted-foreground">785</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;