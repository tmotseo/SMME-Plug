# SMME-Plug

A web application connecting SMMEs (Small, Medium, and Micro Enterprises) with professionals and job seekers.

## Project Structure

```
smme-plug/
├── src/                    # Frontend (Vue.js)
│   ├── components/         # Vue components
│   ├── pages/              # Page components
│   ├── stores/             # Pinia/Vue stores (state management)
│   ├── lib/                # Supabase client
│   └── router/             # Vue Router configuration
│
├── server/                 # Backend (Express.js API)
│   └── index.js            # Express server with Supabase
│
├── supabase/               # Supabase migrations
│   └── migrations/
│
└── public/                 # Static assets
```

## Technology Stack

- **Frontend**: Vue 3 + Vite + Vue Router
- **Backend**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Development

### Prerequisites

- Node.js 20+
- Supabase account

### Frontend Development

```sh
# Install dependencies
npm install

# Start frontend development server
npm run dev
```

### Backend Development

```sh
# Start backend API server (requires Supabase credentials)
npm run server
```

### Full Stack Development

```sh
# Run both frontend and backend concurrently
npm run dev:full
```

## Supabase Setup

### 1. Configure Environment Variables

Copy `.env.example` to `.env` and set your Supabase credentials:

```sh
# Frontend - Supabase Client
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend - Express Server
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 2. Apply Database Schema

Requires Supabase CLI.

```sh
npm run db:supabase:link
npm run db:supabase:push
```

Migration files are in `supabase/migrations/`:

- `20260303_001_init.sql` - Core tables (registrations, opportunities, admins)
- `20260303_002_admin_auth.sql` - Admin authentication

### 3. Generate TypeScript Types (Optional)

```sh
npm run db:supabase:types
```

## Deployment

### Frontend Build

```sh
npm run deploy:build
```

Set these environment variables in your hosting provider:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Backend Deployment

Deploy the Express server separately with:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

## Authentication

### Admin Authentication

1. In Supabase Dashboard → Authentication → Users, create a user with email/password
2. Add the same email to the `public.admins` table and mark it active

Example SQL:

```sql
insert into public.admins (email, display_name, is_active)
values ('admin@example.com', 'Platform Admin', true)
on conflict (email) do update set is_active = true;
```

The app signs in with Supabase Auth, then verifies the signed-in email exists in `public.admins` as active.

## API Endpoints

The backend provides these RESTful endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/registrations` | List all registrations |
| GET | `/api/registrations/:id` | Get single registration |
| POST | `/api/registrations` | Create registration |
| PUT | `/api/registrations/:id` | Update registration |
| PATCH | `/api/registrations/:id/status` | Update status |
| POST | `/api/registrations/:id/messages` | Add message |
| GET | `/api/stats` | Get statistics |
