# JourneyJolt 🚀

An AI Agent for planning your trips and elevate your travelling experience.

**JourneyJolt – The best way to plan your next adventure.**

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
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth
BETTER_AUTH_SECRET=                     # Required: Secret key for authentication
BETTER_AUTH_URL=http://localhost:3000   # Must match the app url for the authentication process to work properly


# Database
DATABASE_URL=                           # Required: PostgreSQL connection string

# AI
OPENAI_API_KEY=                         # Key to access openAI API
GOOGLE_GENERATIVE_AI_API_KEY=           # Key to access Google Gemini API
AI_PROVIDER=                            # Select which AI model will assist, values:{"google", "openAI"}
                                        # Default and Best model is Google's Gemini

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=                       # Required for Gmail integration
GOOGLE_CLIENT_SECRET=                   # Required for Gmail integration
GOOGLE_REDIRECT_URI=                    # Required for Gmail integration

```

### Running Locally

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Page Routing Documentation

```
/app
  ├── /auth
  │   ├── /login          # User login page
  │   └── /signup         # New user registration
  │
  ├── /onboarding         # Protected - Initial user setup
  │
  └── /dashboard          # All sub-routes are protected and user specific
      ├── /chat           # Main chat page to book trips
      ├── /trips          # Current and upcoming trips
      │   └── /past       # Past trips history
      ├── /passengers     # Passenger management
      └── /settings       # User account settings

```

### Authentication Routes:

The authentication system currently provides two main routes for user access:

- Login route for existing users
- Signup route for new user registration

#### 1. Login `/login`

The login route handles authentication for existing users.

**Components and Features**

- Email input field
- Password input field
- Submit button
- "Forgot Password?" link _(TODO)_
- Option to continue with Google Account
- Link to signup page for new users

#### 2. Signup `/signup`

The signup route handles new user registration.

**Components and Features**

- Email input field
- Password input field
- Submit button
- Option to continue with Google Account
- Link to login page for existing users

### Onboarding Routes

The onboarding procedure allows the user to input data necessary for the smooth flow of the app

#### Onboarding `/onboarding`

Displays three different forms for the user to fill

- Passenger Information
- Payment Information
- Magic Word

**Components and Features**

1. Passenger Form _(sensitive information)_:

- First and Last Name input fields
- Nationality input field
- Passport Number input field
- Passport Expiry Date input
- Date of Birth input
- Option to add more than one passengers ( eg. family members, co-workers etc.)

2. Payment Information Form:

- Card Number input field
- Expiry Date input field (mm/yy)
- CVV input field

3. Magic Word form

- Magic Word input field
  (Magic Word will be used to confirm the identity of the user when booking a trip)

### Protected Dashboard Routes

The dashboard section provides the main interface for user interactions after authentication. All dashboard routes are protected and require user authentication to access. Each route serves a specific purpose in the user's journey, from booking trips to managing passenger information. All routes are accessible from the sidebar.

#### 1. Chat `/dashboard/chat`

The main interface for trip booking and customer service interactions.

**Components and Features**

- AI-powered chat interface for trip booking in real-time
- Can book flights and accommodation for any passenger the user has added
- Can display info about the booking if asked (eg. boarding pass, accommondation amenities etc.)

#### 2. Trips `/dashboard/trips`

Displays all current and upcoming trips.

**Components and Features**

- Overview of upcoming trips
- Trip details and itineraries

#### 3. Past Trips `/dashboard/trips/past`

Archive of completed trips and travel history.

**Features:**

- Historical trip records
- Past itineraries

#### 4. Passengers `/dashboard/passengers`

Management interface for passenger information and profiles.

**Features:**

- Passenger list management
- Passenger Information archive
  - Passport information
  - Nationality
  - Date of Birth
- Option to add new passengers

#### 5. Settings `/dashboard/settings`

User account and preference management.

**Features: _(todo)_**

_missing_

## Future Enhancements

Planned additions to the authentication system:

- Password recovery route `/forgot-password`
- Email verification route `/verify-email`
- OAuth integration for other social platfroms login
- Booking edit and modification

## Security Considerations

We maintain high security standards across all authentication routes:

- All routes use HTTPS
- Passwords must meet minimum security requirements, checked by Better Auth provider
- Rate limiting should be implemented on all auth routes
- Session management and token handling to be documented

---

//authentication details -> folder(lib-auth)
//db how does it work?
