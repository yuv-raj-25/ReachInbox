import { Search, Filter, RefreshCw, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Email {
  id: string;
  to: string;
  subject: string;
  preview: string;
  date: string;
  time: string;
  isStarred?: boolean;
}

interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
  loading?: boolean;
}

const EmailList = ({ emails, onEmailClick, loading = false }: EmailListProps) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Search Bar */}
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-10 h-10 bg-transparent border-border"
          />
        </div>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Filter className="h-4 w-4" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Email Items */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading emails...</p>
            </div>
          </div>
        ) : emails.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">No emails found</p>
            </div>
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              onClick={() => onEmailClick(email)}
              className="px-6 py-4 border-b border-border hover:bg-muted/50 cursor-pointer flex items-center gap-4"
            >
              <div className="min-w-[140px]">
                <span className="text-sm text-foreground">To: {email.to}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-badge/10 text-orange-badge whitespace-nowrap">
                  <span className="h-1 w-1 rounded-full bg-orange-badge"></span>
                  {email.date} {email.time}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{email.subject}</span>
                <span className="text-sm text-muted-foreground"> - {email.preview}</span>
              </div>

              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <Star className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmailList;