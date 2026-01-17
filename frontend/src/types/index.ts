export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: string[];
  subject: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
}

export interface EmailFolder {
  id: string;
  name: string;
  icon: string;
  count: number;
}
