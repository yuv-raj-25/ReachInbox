import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import EmailList from "@/components/EmailList";
import EmailDetail from "@/components/EmailDetails";
import ComposeEmail from "@/components/ComposeEmail";
import api from "@/lib/api";

type View = "list" | "detail" | "compose";

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

const Dashboard = () => {
  const [view, setView] = useState<View>("list");
  const [activeTab, setActiveTab] = useState<"scheduled" | "sent">("scheduled");
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Fetch emails when tab changes
  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === "scheduled" 
          ? '/api/emails/scheduled' 
          : '/api/emails/sent';
        
        const response = await api.get(endpoint);
        setEmails(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch emails:', error);
        setEmails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [activeTab]);

  const handleCompose = () => {
    setView("compose");
  };

  const handleEmailClick = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      setSelectedEmail(email);
      setView("detail");
    }
  };

  const handleBack = () => {
    setView("list");
    setSelectedEmail(null);
  };

  const handleTabChange = (tab: "scheduled" | "sent") => {
    setActiveTab(tab);
    setView("list"); // Always go back to list view when changing tabs
  };

  const transformedEmails = emails.map(email => ({
    id: email.id,
    to: email.recipient_email,
    subject: email.subject,
    preview: email.body.substring(0, 50) + '...',
    date: new Date(activeTab === 'sent' && email.sent_at ? email.sent_at : email.scheduled_at).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    time: ""
  }));

  return (
    <div className="flex h-screen w-screen fixed inset-0 bg-background overflow-hidden">
      <Sidebar
        onCompose={handleCompose}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden border-l-2 border-dashed border-blue-dashed">
        {view === "list" && (
          <EmailList 
            emails={transformedEmails} 
            onEmailClick={(email) => handleEmailClick(email.id)}
            loading={loading}
          />
        )}
        {view === "detail" && selectedEmail && <EmailDetail email={selectedEmail} onBack={handleBack} />}
        {view === "compose" && <ComposeEmail onBack={handleBack} />}
      </div>
    </div>
  );
};

export default Dashboard;