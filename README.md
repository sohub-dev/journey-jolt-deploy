# JourneyJolt 🚀

An AI Agent for planning your trips.

🤍 **JourneyJolt – The best way to plan your next adventure.**

## Tech Stack

JourneyJolt is built with modern and reliable technologies:

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, ShadCN
- **Backend**: Node.js, Drizzle
- **Database**: PostgreSQL
- **Authentication**: Better Auth, Google OAuth

## Getting Started

### Prerequisites

**Required Versions:**

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker >= 20.10.0

Before running the application, you'll need to set up several services and environment variables:

1. **Setup Local Services with Docker**

   - Make sure you have [Docker](https://docs.docker.com/get-docker/), [NodeJS](https://nodejs.org/en/download/), and [pnpm](https://pnpm.io/installation) installed.
   - Clone the repository: `git clone https://github.com/socratesomiliadis/journey-jolt.git`
   - Install all dependencies: `pnpm install`
   - Copy the example env, `cp .env.example .env`
   - Run `pnpm docker:up` to start the database and other services.
   - Run `pnpm db:push` to sync your schema with the database
   - Use `pnpm db:studio` to view and manage your data

2. **Better Auth Setup**

   - Open `.env` and change the BETTER_AUTH_SECRET to a random string. (Use `openssl rand -hex 32` to generate a 32 character string)

     ```env
     BETTER_AUTH_SECRET=your_secret_key
     ```

3. **Google OAuth Setup (Optional)**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the Google OAuth2 API
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback"` (development)
     - `https://your-production-url/api/auth/google/callback` (production)
   - Add to `.env`:

     ```env
     GOOGLE_CLIENT_ID=your_client_id
     GOOGLE_CLIENT_SECRET=your_client_secret
     GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
     ```

> [!IMPORTANT]
> The `GOOGLE_REDIRECT_URI` must match **exactly** what you configure in the Google Cloud Console, including the protocol (http/https), domain, and path - these are provided above.

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```env
# Auth
BETTER_AUTH_SECRET=     # Required: Secret key for authentication

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=       # Required for Gmail integration
GOOGLE_CLIENT_SECRET=   # Required for Gmail integration
GOOGLE_REDIRECT_URI=    # Required for Gmail integration

# Database
DATABASE_URL=          # Required: PostgreSQL connection string
```

### Running Locally

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


//explain how routes and pages work
//authentication details -> folder(lib-auth)
//db how does it work?
