import { ArrowLeft, Star, Archive, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EmailDetailProps {
  onBack: () => void;
}

const EmailDetail = ({ onBack }: EmailDetailProps) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium text-foreground">
            Oliver, hello there! | MJWYT44 BM#52W01
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
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">OB</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl">
          {/* Sender Info */}
          <div className="flex items-start gap-4 mb-8">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-teal-avatar text-white font-medium">A</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-foreground">Amanda Clark</span>
                  <span className="text-muted-foreground ml-2">&lt;sender@example.com&gt;</span>
                </div>
                <span className="text-sm text-muted-foreground">Nov 3, 10:23 AM</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">to me ∨</p>
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-6 text-foreground">
            <p>Hey Oliver,</p>
            
            <p>You've just RECEIVED something</p>
            
            <div className="border-2 border-dashed border-blue-dashed rounded-lg p-4 bg-blue-50">
              <p className="text-foreground">
                ⚡ <strong className="text-primary">Extremely Exclusive—Only 4 Spots Worldwide Per Year | $25,000 investment</strong> ⚡
              </p>
              <p className="text-foreground mt-2">
                ⚡ To explore securing your private transformation, simply reply right now with "<strong>FLY OUT FIX</strong>" .
              </p>
            </div>

            <p>Your coach for world-class performance,</p>
            
            <p>Grant</p>

            <p className="italic text-muted-foreground">P.S. Always remember that you can develop world class technique! 🚀</p>
          </div>

          {/* Attachments */}
          <div className="mt-8 flex gap-4">
            <div className="rounded-lg overflow-hidden border border-border">
              <div className="w-40 h-28 bg-blue-100 relative">
              </div>
              <div className="p-2 bg-card">
                <p className="text-xs font-medium text-foreground truncate">Tennis_Coach_Profile.png</p>
                <p className="text-xs text-muted-foreground">1.2 MB</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border">
              <div className="w-40 h-28 bg-blue-100 relative">
              </div>
              <div className="p-2 bg-card">
                <p className="text-xs font-medium text-foreground truncate">Tennis_Coach_Profile2.png</p>
                <p className="text-xs text-muted-foreground">1.2 MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
