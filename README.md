# ReachInbox Assignment - Email Scheduling & Management System

A full-stack application for scheduling and managing bulk emails with Google OAuth integration, real-time analytics, and CSV bulk upload capabilities.


## 🚀 Features

- **Authentication**: Secure Google Login using OAuth 2.0.
- **Email Scheduling**: Schedule emails to be sent at a specific future time.
- **Bulk Sending**: Upload CSV files to send emails to multiple recipients.
- **Dynamic Dashboard**:
  - View "Scheduled" and "Sent" email tabs.
  - Real-time counts of email statuses.
  - Detailed view of email content.
- **Robust Backend**:
  - Rate limiting (50 emails/hour).
  - Background job processing with BullMQ & Redis.
  - PostgreSQL database for persistent storage.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL.
- **Queue/Caching**: Redis, BullMQ.
- **Authentication**: Google OAuth 2.0, JWT.

---

## 🏃‍♂️ Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18+)
- **PostgreSQL** (running on port 5431 or update env)
- **Redis** (running on default port 6379)

### 1. Clone the Repository

```bash
git clone <repository_url>
cd reachinbox-assignment
```

### 2. Backend Setup

Navigate to the server directory:

```bash
cd server
```

**Install Dependencies:**

```bash
npm install
```

**Environment Configuration:**

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

> **Note:** You will need valid `GOOGLE_CLIENT_ID` and `GOOGLE_SECRET_ID` for authentication to work.

**Database Setup:**

Ensure your PostgreSQL database is running. The application connects to `reachinbox` database by default.

**Start the Server:**

```bash
npm run dev
```
*Server runs on http://localhost:5000*

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

**Install Dependencies:**

```bash
npm install
```

**Environment Configuration:**

Copy the example environment file:

```bash
cp .env.example .env
```

**Start the Development Server:**

```bash
npm run dev
```
*Frontend runs on http://localhost:5173*

---

## 📖 Usage Guide

1.  **Login**: Open the frontend URL and sign in using your Google account.
2.  **Dashboard**: You will see your dashboard with "Scheduled" and "Sent" tabs.
3.  **Compose Email**:
    *   Click "Compose Email".
    *   **To**: Enter manual emails or use **Upload List** to upload a CSV.
    *   **Body**: Write your email content.
    *   **Schedule**: Click the Clock icon to pick a time, or click "Send" for immediate delivery.
4.  **CSV Upload**:
    *   Click the **Upload Icon (📤)** in the compose header.
    *   Select a `.csv` file containing email addresses.
    *   The recipients will be automatically added.
5.  **View Status**:
    *   **Scheduled Tab**: Shows emails waiting to be sent (processed by background worker).
    *   **Sent Tab**: Shows successfully delivered emails.

## ⚙️ Architecture

- **Email Worker**: A background worker (`email.worker.ts`) runs alongside the server to process the email queue. It handles rate limiting and moves emails from `scheduled` to `sent` status.
- **Rate Limiting**: Configured to 50 emails/hour (configurable in `.env`) to prevent spamming.

## 🧪 Development

- **Server**: Uses `nodemon` for hot-reloading.
- **Frontend**: Uses `vite` for fast HMR.
- **Linting**: ESLint configured for code quality.

---

**Developed by Yuvraj**
