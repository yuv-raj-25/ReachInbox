# ReachInbox Assignment - Email Scheduling & Management System

A production-grade email scheduling and management system inspired by ReachInbox.  
The system supports bulk email scheduling, rate-limited delivery, retry-safe background processing, and restart-safe execution using Redis and BullMQ.


![Dashboard Preview](https://placehold.co/800x400?text=ReachInbox+Dashboard)

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
## 🧠 System Design Overview

The system is designed with reliability and scale in mind:

- PostgreSQL acts as the **source of truth** for all emails.
- Each recipient email is stored as a separate record with status tracking.
- For every email record, a BullMQ job is created with a calculated delay.
- Redis persists all queue state, ensuring jobs survive server or worker restarts.
- A background worker processes jobs, enforces rate limits, and sends emails.

This design ensures:
- No duplicate sends
- No lost emails
- Correct behavior across restarts


## ⏱️ Rate Limiting Strategy

To mimic real-world email provider constraints, the system enforces rate limits:

- Configurable maximum emails per hour (default: 50/hour)
- Rate limiting is enforced **at the worker level**, not at API ingestion
- Redis atomic counters track email sends per sender per hour
- When the hourly limit is exceeded:
  - Emails are **not dropped**
  - Jobs are **rescheduled** to the next available hour
  - Order is preserved as much as possible

This approach ensures fairness, reliability, and no data loss under load.

## 🔁 Restart Safety

The system is fully restart-safe:

- Redis persists BullMQ job state
- PostgreSQL persists email status
- On server or worker restart:
  - Scheduled emails continue from where they left off
  - Sent emails are never duplicated
  - Delayed jobs remain intact

This makes the system safe for real-world deployment scenarios.


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

## 🐳 Infrastructure Setup

The project uses Docker to easily set up the required databases.

**1. Install Docker**
Make sure you have Docker and Docker Compose installed on your machine.

**2. Start Services**
Navigate to the server directory and run:

```bash
cd server
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5431` (User/Pass: `reachinbox`/`reachinbox`)
- **Redis** on port `6379`

**3. Stop Services**
To stop the databases:
```bash
docker-compose down
```

## 👷‍♂️ Email Worker

The email worker handles the background processing of scheduled emails.



### Running the Worker
**Option A: Automatic (Recommended)**
The worker is integrated into the main server. Simply running `npm run dev` in the server directory starts both the API server and the Email Worker.

**Option B: Standalone**
If you wish to run the worker independently (e.g., for scaling):
1.  Open a new terminal.
2.  Navigate to `server`.
3.  Run:
    ```bash
    npm run worker
    ```

## ⚖️ Trade-offs & Assumptions

- Pagination is not implemented for email lists (kept simple for MVP).
- Rate limiting is global per sender (multi-tenant logic can be added).
- CSV parsing is handled on the frontend for simplicity and performance.
- Email content supports basic HTML but no template editor is included.
- UI prioritizes clarity over advanced styling.

These choices were made to focus on correctness, reliability, and core scheduling logic.


## 🔌 Key API Endpoints

| Method | Endpoint | Description |
|------|--------|------------|
| POST | /api/auth/google | Google OAuth login |
| POST | /api/emails/bulk-schedule | Schedule bulk emails |
| GET | /api/emails/scheduled | Fetch scheduled emails |
| GET | /api/emails/sent | Fetch sent emails |

## 🧪 Development

- **Server**: Uses `nodemon` for hot-reloading.
- **Frontend**: Uses `vite` for fast HMR.
- **Linting**: ESLint configured for code quality.

---

**Developed by Yuvraj**
