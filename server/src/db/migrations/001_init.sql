CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  status TEXT NOT NULL,
  job_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_scheduled_at ON emails(scheduled_at);
CREATE INDEX idx_emails_user_id ON emails(user_id);



