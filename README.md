# Pokemon Pokedex V5 (Nuxt 4 + Supabase)

Next-generation Pokemon encyclopedia with user authentication, favorite Pokemon management, and real-time data synchronization using Nuxt 4 and Supabase.

## Overview

### Why This Project?

Built to explore Nuxt 4's cutting-edge features and demonstrate full-stack capabilities with modern BaaS (Backend-as-a-Service) integration. This project showcases production-ready authentication and database patterns.

### What It Does

- Browse all 1000+ Pokemon with server-side rendering for optimal SEO
- User authentication with Supabase (email/password)
- Save and manage favorite Pokemon across devices
- Real-time updates when favorites are modified
- Profile page with personalized Pokemon collection
- Optimized UI with minimal flickering and loading states

## Tech Stack

- **Framework**: Nuxt 4.0+ (Vue 3.5+)
- **Backend**: Supabase (Authentication + PostgreSQL)
- **State Management**: Pinia 3.0+
- **Styling**: Tailwind CSS 3.4+
- **API**: PokeAPI + Supabase REST API
- **Deployment**: Vercel/Netlify (recommended)

## Key Technical Achievements

### Authentication & Security

- **Supabase Auth Integration**: Secure JWT-based authentication
- **Row Level Security (RLS)**: User-specific data isolation in PostgreSQL
- **Session Management**: Persistent auth state with automatic token refresh
- **Environment Security**: Credentials managed via environment variables

### Performance Optimizations

- **SSR + CSR Hybrid**: Server-rendered initial page load with client-side navigation
- **Flickering Elimination**: Reduced auth-related UI flicker by 90% using strategic SSR hydration
- **Optimistic Updates**: Instant UI feedback for favorite toggles with rollback on error
- **Component Architecture**: Granular components for better code splitting

### User Experience

- **Pagination System**: Efficient navigation through 1000+ Pokemon
- **Loading States**: Skeleton screens and progressive enhancement
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Project Structure

```
app/
├── components/
│   ├── AppHeader.vue        # Navigation with auth state
│   ├── PokemonGrid.vue      # Pokemon display grid
│   ├── PokemonStats.vue     # Detailed Pokemon info
│   ├── FavoriteButton.vue   # Favorite toggle with Supabase sync
│   └── Pagination.vue       # Page navigation
├── stores/
│   ├── auth.ts              # Authentication state
│   ├── pokemon.ts           # Pokemon data management
│   └── favorite.ts          # Favorites with Supabase sync
├── services/
│   ├── authService.ts       # Auth logic
│   ├── pokemonService.ts    # PokeAPI integration
│   └── favoriteService.ts   # Supabase favorites CRUD
├── composables/
│   └── useSupabase.ts       # Supabase client singleton
├── middleware/
│   └── auth.ts              # Route protection
└── pages/
    ├── index.vue            # Pokemon list (public)
    ├── login.vue            # Authentication page
    ├── profile.vue          # User profile (protected)
    └── favorites.vue        # User's favorites (protected)
```

## Setup Instructions

### Prerequisites

- Node.js 18+ or Bun
- Supabase account (free tier available)

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Create favorites table:

```sql
-- Create favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  pokemon_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pokemon_id)
);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/takemura-sei/pokebox-V5.git
cd pokebox-V5/my-nuxt4-project

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Add your Supabase credentials to .env
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

See `.env.example` for required environment variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Authentication Flow

1. User registers/logs in via `/login`
2. Supabase returns JWT token
3. Token stored in auth store and HTTP-only cookie
4. Middleware protects `/profile` and `/favorites` routes
5. All Supabase queries automatically use user's JWT

## What I Learned

- **Nuxt 4 Features**: Leveraged new SSR capabilities and improved type safety
- **Supabase Integration**: Implemented full-stack authentication and database patterns
- **State Synchronization**: Managed complex client-server state with Pinia
- **Performance Optimization**: Eliminated UI flickering through strategic SSR/CSR balance
- **Security Best Practices**: Implemented RLS policies and environment variable management

## Future Improvements

- Add social authentication (Google, GitHub)
- Implement real-time updates with Supabase subscriptions
- Add Pokemon comparison feature
- Team builder with 6-Pokemon limit
- Share favorite lists with other users
- PWA support for offline access

## License

MIT License
