import { useState } from "react";
import { ArrowLeft, Paperclip, Clock, X, Upload, Undo, Redo, Bold, Italic, Underline, AlignLeft, ChevronUp, ChevronDown, List, ListOrdered, Outdent, Indent, Quote, Save, Strikethrough, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ComposeEmailProps {
  onBack: () => void;
}

const ComposeEmail = ({ onBack }: ComposeEmailProps) => {
  const [showSendLater, setShowSendLater] = useState(false);
  const [recipients, setRecipients] = useState<string[]>(["tame@jmail.com", "lame@jmail.com", "dame@jmail.com"]);
  const [showAllRecipients, setShowAllRecipients] = useState(false);

  const displayedRecipients = showAllRecipients ? recipients : recipients.slice(0, 3);
  const hiddenCount = recipients.length - 3;

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium text-foreground">Compose New Email</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground transition-colors relative">
            <Paperclip className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">1</span>
          </button>
          <button 
            onClick={() => setShowSendLater(!showSendLater)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Clock className="h-5 w-5" />
          </button>
          <Button 
            variant="outline" 
            className="h-9 px-4 border-primary text-primary hover:bg-primary/5"
          >
            Send Later
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-4">
          {/* From */}
          <div className="flex items-center gap-6">
            <label className="w-16 text-sm text-muted-foreground">From</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-input rounded-md">
              <span className="text-sm text-foreground">oliver.brown@domain.io</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* To */}
          <div className="flex items-center gap-6 border-b border-border pb-4">
            <label className="w-16 text-sm text-muted-foreground">To</label>
            <div className="flex-1 flex items-center gap-2 flex-wrap">
              {displayedRecipients.map((email, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted rounded-full text-sm text-foreground"
                >
                  {email}
                  <button className="text-muted-foreground hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {hiddenCount > 0 && !showAllRecipients && (
                <button
                  onClick={() => setShowAllRecipients(true)}
                  className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground"
                >
                  +{hiddenCount}
                </button>
              )}
            </div>
            <button className="flex items-center gap-1 text-primary text-sm font-medium">
              <Upload className="h-4 w-4" />
              Upload List
            </button>
          </div>

          {/* Subject */}
          <div className="flex items-center gap-6 border-b border-border pb-4">
            <label className="w-16 text-sm text-muted-foreground">Subject</label>
            <Input
              placeholder="Subject"
              className="flex-1 border-0 bg-transparent px-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Delay Settings */}
          <div className="flex items-center gap-6 pb-4">
            <label className="text-sm text-muted-foreground">Delay between 2 emails</label>
            <div className="w-16">
              <Input
                defaultValue="00"
                className="h-9 text-center bg-input border-0 text-foreground"
              />
            </div>
            <label className="text-sm text-muted-foreground ml-4">Hourly Limit</label>
            <div className="w-16">
              <Input
                defaultValue="00"
                className="h-9 text-center bg-input border-0 text-foreground"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="dashed-border-blue rounded-lg overflow-hidden">
            <div className="p-4">
              <Input
                placeholder="Type Your Reply..."
                className="border-0 bg-transparent px-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground mb-4"
              />
              
              {/* Toolbar */}
              <div className="flex items-center gap-1 border-t border-border pt-4 flex-wrap">
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <Undo className="h-4 w-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <Redo className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors flex items-center gap-1">
                  <span className="text-sm">Tt</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <Bold className="h-4 w-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <Italic className="h-4 w-4" />
                </button>
                <button className="p-2 text-primary bg-primary/10 rounded transition-colors">
                  <Underline className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors flex items-center">
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="h-3 w-3" />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <ListOrdered className="h-4 w-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <List className="h-4 w-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <Outdent className="h-4 w-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <Indent className="h-4 w-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <Quote className="h-4 w-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <Save className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                  <Strikethrough className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[300px] p-4"></div>
          </div>

          {/* Attachment Preview */}
          <div className="pt-4">
            <div className="w-32 rounded-lg overflow-hidden border border-border">
              <div className="h-20 bg-blue-100">
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Later Popup */}
      {showSendLater && (
        <div className="absolute top-16 right-6 w-64 bg-card rounded-lg border border-border shadow-lg p-4">
          <h3 className="font-medium text-foreground mb-4">Send Later</h3>
          
          <button className="w-full flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-foreground">
            <span>Pick date & time</span>
            <Calendar className="h-4 w-4" />
          </button>
          
          <div className="space-y-1 mt-2">
            <button className="w-full py-2 text-left text-sm text-foreground hover:bg-muted rounded px-2">
              Tomorrow
            </button>
            <button className="w-full py-2 text-left text-sm text-foreground hover:bg-muted rounded px-2">
              Tomorrow, 10:00 AM
            </button>
            <button className="w-full py-2 text-left text-sm text-foreground hover:bg-muted rounded px-2">
              Tomorrow, 11:00 AM
            </button>
            <button className="w-full py-2 text-left text-sm text-foreground hover:bg-muted rounded px-2">
              Tomorrow, 3:00 PM
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSendLater(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/5"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComposeEmail;
