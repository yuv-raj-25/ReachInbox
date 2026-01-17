import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import EmailList from "@/components/EmailList";
import EmailDetail from "@/components/EmailDetails";
import ComposeEmail from "@/components/ComposeEmail";

type View = "list" | "detail" | "compose";

const mockEmails = [
  {
    id: "1",
    to: "John Smith",
    subject: "Meeting follow-up - Scheduled",
    preview: "Hi John, just wanted to follow up on our meeting...",
    date: "Tue 9:15:12 AM",
    time: "",
  },
  {
    id: "2",
    to: "Olive",
    subject: "Ramit, great to meet you - you'll love it",
    preview: "Hi Olive, just wanted to follow up on our meeting...",
    date: "Thu 8:15:12 PM",
    time: "",
  },
];

const Dashboard = () => {
  const [view, setView] = useState<View>("list");
  const [activeTab, setActiveTab] = useState<"scheduled" | "sent">("scheduled");

  const handleCompose = () => {
    setView("compose");
  };

  const handleEmailClick = () => {
    setView("detail");
  };

  const handleBack = () => {
    setView("list");
  };

  return (
    <div className="flex h-screen w-screen fixed inset-0 bg-background overflow-hidden">
      <Sidebar
        onCompose={handleCompose}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden border-l-2 border-dashed border-blue-dashed">
        {view === "list" && (
          <EmailList emails={mockEmails} onEmailClick={handleEmailClick} />
        )}
        {view === "detail" && <EmailDetail onBack={handleBack} />}
        {view === "compose" && <ComposeEmail onBack={handleBack} />}
      </div>
    </div>
  );
};

export default Dashboard;