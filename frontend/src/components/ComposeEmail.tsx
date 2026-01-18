import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, X, Upload, Undo, Redo, Bold, Italic, Underline, AlignLeft, ChevronUp, ChevronDown, List, ListOrdered, Outdent, Indent, Quote, Save, Strikethrough } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import CsvUploader from "./CsvUploader";

interface AttachmentFile {
  file: File;
  preview: string | null;
}

interface ComposeEmailProps {
  onBack: () => void;
}

const ComposeEmail = ({ onBack }: ComposeEmailProps) => {
  const navigate = useNavigate();
  const [showSendLater, setShowSendLater] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [toInput, setToInput] = useState("");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [senderEmail, setSenderEmail] = useState("");
  const [delayMs, setDelayMs] = useState("60000"); // 1 minute default
  const [showCsvUploader, setShowCsvUploader] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user email from localStorage on mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setSenderEmail(userData.email || '');
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  const displayedRecipients = showAllRecipients ? recipients : recipients.slice(0, 3);
  const hiddenCount = recipients.length - 3;

  const handleCsvEmailsExtracted = (emails: string[]) => {
    // Add all emails from CSV to recipients, avoiding duplicates
    setRecipients((prev) => {
      const combined = [...prev, ...emails];
      return [...new Set(combined)]; // Remove duplicates
    });
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: AttachmentFile[] = [];
    
    Array.from(files).forEach((file) => {
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAttachments((prev) => [
            ...prev,
            { file, preview: event.target?.result as string },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        newAttachments.push({ file, preview: null });
      }
    });

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
    }

    // Reset input to allow selecting the same file again
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeRecipient = (index: number) => {
    setRecipients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const email = toInput.trim().replace(",", "");
      if (email && email.includes("@")) {
        setRecipients((prev) => [...prev, email]);
        setToInput("");
      }
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return "📄";
    if (file.type.includes("word") || file.type.includes("document")) return "📝";
    if (file.type.includes("sheet") || file.type.includes("excel")) return "📊";
    if (file.type.includes("zip") || file.type.includes("rar")) return "📦";
    return "📎";
  };

  const handleScheduleEmail = async () => {
    // Validation
    if (recipients.length === 0) {
      alert("Please add at least one recipient");
      return;
    }
    if (!subject.trim()) {
      alert("Subject is required");
      return;
    }
    if (!emailBody.trim()) {
      alert("Email body cannot be empty");
      return;
    }

    // If no scheduled date, send immediately (use current time + 10 seconds)
    const selectedTime = scheduledDate 
      ? new Date(scheduledDate) 
      : new Date(Date.now() + 10000); // 10 seconds from now for immediate send

    // Check if scheduled date is in the future (only if user selected a time)
    if (scheduledDate && selectedTime <= new Date()) {
      alert("Scheduled time must be in the future");
      return;
    }

    setIsScheduling(true);

    const payload = {
      senderEmail,
      subject,
      body: emailBody,
      recipients,
      startTime: selectedTime.toISOString(),
      delayBetweenEmailsMs: parseInt(delayMs) || 60000,
    };

    try {
      await api.post('/api/emails/bulk-schedule', payload);
      
      const successMessage = scheduledDate 
        ? `Email scheduled successfully for ${selectedTime.toLocaleString()}`
        : `Email sent successfully!`;
      alert(successMessage);
      
      // Navigate back to dashboard and show scheduled tab
      navigate('/dashboard');
      onBack();
    } catch (error: any) {
      console.error('Failed to schedule email:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Payload sent:', payload);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to schedule email. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt"
      />

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium text-foreground">Compose New Email</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAttachmentClick}
            className="text-muted-foreground hover:text-foreground transition-colors relative"
          >
            {/* <Paperclip className="h-5 w-5" /> */}
            {attachments.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                {attachments.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setShowSendLater(!showSendLater)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Clock className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setShowCsvUploader(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Upload CSV"
          >
            <Upload className="h-5 w-5" />
          </button>
          <Button 
            variant="outline" 
            className="h-9 px-4 border-primary text-primary hover:bg-primary/5"
            onClick={handleScheduleEmail}
            disabled={isScheduling}
          >
            {isScheduling ? 'Scheduling...' : (scheduledDate ? 'Send Later' : 'Send')}
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
              <span className="text-sm text-foreground">{senderEmail || 'loading...'}</span>
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
                  <button 
                    onClick={() => removeRecipient(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
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
              <Input
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                onKeyDown={handleToInputKeyDown}
                placeholder="recipient@example.com"
                className="flex-1 min-w-[200px] border-0 bg-transparent px-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button 
              onClick={() => setShowCsvUploader(true)}
              className="flex items-center gap-1 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload List
            </button>
          </div>

          {/* Subject */}
          <div className="flex items-center gap-6 border-b border-border pb-4">
            <label className="w-16 text-sm text-muted-foreground">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="flex-1 border-0 bg-transparent px-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Delay Settings */}
          <div className="flex items-center gap-6 pb-4">
            <label className="text-sm text-muted-foreground">Delay between 2 emails (ms)</label>
            <div className="w-32">
              <Input
                value={delayMs}
                onChange={(e) => setDelayMs(e.target.value)}
                type="number"
                className="h-9 text-center bg-input border-0 text-foreground"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="dashed-border-blue rounded-lg overflow-hidden">
            <div className="p-4">
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Type Your Reply..."
                className="min-h-[250px] border-0 bg-transparent px-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground resize-none mb-4"
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
          </div>

          {/* Attachment Previews */}
          {attachments.length > 0 && (
            <div className="pt-4 flex flex-wrap gap-3">
              {attachments.map((attachment, index) => (
                <div key={index} className="relative group">
                  <div className="w-32 rounded-lg overflow-hidden border border-border">
                    {attachment.preview ? (
                      <div className="h-20 bg-muted">
                        <img 
                          src={attachment.preview}
                          alt={attachment.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-20 bg-muted flex items-center justify-center">
                        <span className="text-3xl">{getFileIcon(attachment.file)}</span>
                      </div>
                    )}
                    <div className="p-1.5 bg-background">
                      <p className="text-xs text-muted-foreground truncate">
                        {attachment.file.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send Later Popup */}
      {showSendLater && (
        <div className="absolute top-16 right-6 w-80 bg-card rounded-lg border border-border shadow-lg p-4 z-50">
          <h3 className="font-medium text-foreground mb-4">Schedule Email</h3>
          
          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-2 block">Pick date & time</label>
            <Input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {scheduledDate && (
            <div className="mb-4 p-2 bg-muted rounded text-sm text-foreground">
              Scheduled for: {new Date(scheduledDate).toLocaleString()}
            </div>
          )}
          
          <div className="space-y-1 mb-4">
            <p className="text-xs text-muted-foreground mb-2">Quick presets:</p>
            <button 
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(9, 0, 0, 0);
                setScheduledDate(tomorrow.toISOString().slice(0, 16));
              }}
              className="w-full py-2 text-left text-sm text-foreground hover:bg-muted rounded px-2"
            >
              Tomorrow, 9:00 AM
            </button>
            <button 
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(14, 0, 0, 0);
                setScheduledDate(tomorrow.toISOString().slice(0, 16));
              }}
              className="w-full py-2 text-left text-sm text-foreground hover:bg-muted rounded px-2"
            >
              Tomorrow, 2:00 PM
            </button>
            <button 
              onClick={() => {
                const nextHour = new Date();
                nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
                setScheduledDate(nextHour.toISOString().slice(0, 16));
              }}
              className="w-full py-2 text-left text-sm text-foreground hover:bg-muted rounded px-2"
            >
              In 1 hour
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
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
              onClick={() => setShowSendLater(false)}
              disabled={!scheduledDate}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* CSV Uploader Modal */}
      {showCsvUploader && (
        <CsvUploader
          onEmailsExtracted={handleCsvEmailsExtracted}
          onClose={() => setShowCsvUploader(false)}
        />
      )}
    </div>
  );
};

export default ComposeEmail;
