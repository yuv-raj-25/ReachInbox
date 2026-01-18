import { ArrowLeft, Star, Archive, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Email {
  id: string;
  sender_email: string;
  recipient_email: string;
  subject: string;
  body: string;
  scheduled_at: string;
  sent_at?: string;
  status: string;
  created_at: string;
}

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
}

const EmailDetail = ({ email, onBack }: EmailDetailProps) => {
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium text-foreground">
            {email.subject}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Star className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Archive className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Trash2 className="h-5 w-5" />
          </button>
          <Avatar className="h-8 w-8 ml-2">
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">{getInitials(email.recipient_email)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl">
          {/* Sender Info */}
          <div className="flex items-start gap-4 mb-8">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-teal-avatar text-white font-medium">{getInitials(email.sender_email)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-foreground">From: </span>
                  <span className="text-muted-foreground">&lt;{email.sender_email}&gt;</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(email.status === 'sent' && email.sent_at ? email.sent_at : email.scheduled_at)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">to {email.recipient_email}</p>
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-4 text-foreground whitespace-pre-wrap">
            {email.body}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
