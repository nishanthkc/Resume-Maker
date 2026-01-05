# Google OAuth Sign-In Implementation

This document explains how Google OAuth authentication is integrated into the Resume Maker application using Supabase Auth with PKCE (Proof Key for Code Exchange) flow.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Reference Links](#reference-links)
- [Implementation Details](#implementation-details)
- [Setup Instructions](#setup-instructions)
- [How It Works](#how-it-works)

## Overview

We've implemented Google OAuth sign-in/sign-up using Supabase Auth, which provides a secure, serverless authentication solution. The implementation uses the **PKCE flow** (recommended for Next.js App Router) for enhanced security compared to the implicit flow.

### Key Features

- **PKCE Flow**: More secure OAuth flow that prevents authorization code interception
- **Server-Side Rendering Safe**: Uses cookie-based sessions compatible with Next.js App Router
- **Real-time Auth State**: Automatically syncs authentication state across the application
- **Type-Safe**: Full TypeScript support with proper type definitions

## Architecture

The authentication flow follows this sequence:

```
User clicks "Sign In" 
  → Redirects to Google OAuth consent screen
  → User authenticates with Google
  → Google redirects to /auth/callback with authorization code
  → Server exchanges code for session (PKCE)
  → Session saved to HTTP-only cookies
  → User redirected back to original page
  → Auth context updates with user data
  → Navbar shows user info and "Sign Out" button
```

## Reference Links

### Supabase Documentation

- [MAIN DOC: Supabase Auth with Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Auth with Next.js App Router](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase SSR Package (@supabase/ssr)](https://supabase.com/docs/reference/javascript/ssr-package)
- [PKCE Flow Explanation](https://supabase.com/docs/guides/auth/server-side/nextjs#pkce-flow)

### Next.js Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Server Components vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

### Youtube and Medium References

- [Youtube: How to add Google OAuth in Nextjs with Supabase | Server Component | Server Action | Google Login](https://www.youtube.com/watch?v=XgqCh2FwNVY)
- [Medium blog: Get Google OAuth with NextJS and Supabase working locally](https://medium.com/@olliedoesdev/nextjs-supabase-google-oauth-on-localhost-0fe8b6341785)

## Implementation Details

### 1. Supabase Client Utilities

#### Client-Side Client (`utils/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Explanation:**
- Uses `createBrowserClient` from `@supabase/ssr` for browser-based authentication
- Automatically handles cookie management in the browser
- Used in client components to interact with Supabase Auth
- Reads environment variables that are prefixed with `NEXT_PUBLIC_` (exposed to the browser)

#### Server-Side Client (`utils/supabase/server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
```

**Explanation:**
- Uses `createServerClient` for server-side operations (API routes, Server Components)
- Integrates with Next.js `cookies()` API to read/write HTTP-only cookies
- The `getAll()` and `setAll()` methods allow Supabase to manage session cookies securely
- The try-catch in `setAll()` handles cases where cookies can't be set (e.g., in Server Components during render)

### 2. OAuth Callback Route (`app/auth/callback/route.ts`)

```typescript
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Successful authentication, redirect to the original page or home
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's an error or no code, redirect to an error page or home
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
```

**Explanation:**
- This is a Next.js Route Handler that processes the OAuth callback
- Extracts the authorization `code` from the URL query parameters
- Uses `exchangeCodeForSession()` to complete the PKCE flow by exchanging the code for a session
- The session is automatically saved to HTTP-only cookies by the server client
- On success, redirects the user back to their original page (via `next` parameter) or home
- On error, redirects to an error page

**PKCE Flow Details:**
- When `signInWithOAuth()` is called, Supabase generates a code verifier and challenge
- The challenge is sent to Google during OAuth
- Google redirects back with an authorization code
- `exchangeCodeForSession()` uses the code + verifier to get the session tokens
- This prevents code interception attacks (the main benefit of PKCE)

### 3. Auth Context (`context/auth-context.tsx`)

```typescript
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
      },
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }, [supabase.auth]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, [supabase.auth]);

  // ... provider and hook implementation
}
```

**Explanation:**

**State Management:**
- `user`: Current authenticated user object (null if not authenticated)
- `session`: Current session object containing access/refresh tokens
- `loading`: Boolean indicating if auth state is being initialized

**Initialization (`useEffect`):**
1. Calls `getSession()` to check if user is already authenticated (e.g., page refresh)
2. Sets up `onAuthStateChange` listener to react to auth events (login, logout, token refresh)
3. Updates state whenever auth state changes
4. Cleans up subscription on unmount

**Sign In Function:**
- Calls `signInWithOAuth()` with `provider: 'google'`
- Sets `redirectTo` to our callback route with the current pathname as `next` parameter
- This preserves where the user was when they clicked "Sign In"
- Automatically redirects browser to Google OAuth consent screen

**Sign Out Function:**
- Calls `signOut()` which clears the session and cookies
- The auth state listener automatically updates the UI when logout completes

### 4. Navbar Integration (`components/layout/navbar.tsx`)

```typescript
'use client';

import { useAuth } from '@/context/auth-context';

export default function Navbar() {
  const { user, loading, signIn, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <nav>
      {/* ... */}
      {loading ? (
        <div>Loading...</div>
      ) : user ? (
        <div>
          <span>{user.email || user.user_metadata?.full_name || 'User'}</span>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : (
        <Button onClick={handleSignIn}>Sign In</Button>
      )}
    </nav>
  );
}
```

**Explanation:**
- Uses `useAuth()` hook to access authentication state
- Conditionally renders UI based on auth state:
  - **Loading**: Shows "Loading..." while checking auth state
  - **Authenticated**: Shows user email/name and "Sign Out" button
  - **Not Authenticated**: Shows "Sign In" button
- Clicking "Sign In" triggers OAuth flow
- Clicking "Sign Out" clears session and updates UI

### 5. Root Layout Integration (`app/layout.tsx`)

```typescript
import { AuthProvider } from "@/components/providers/auth-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Explanation:**
- Wraps the entire app with `AuthProvider` to make auth state available everywhere
- Placed inside `ThemeProvider` (both are client components)
- The `Navbar` and all pages can now use `useAuth()` hook

## Setup Instructions

### 1. Install Dependencies

The following packages are required:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Where to find these:**
- Go to your Supabase project dashboard
- Navigate to Settings → API
- Copy the "Project URL" and "anon public" key

### 3. Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication → Providers**
3. Enable **Google** provider
4. You'll need to add:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

### 4. Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** (or Google Identity Services)
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Configure:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (for local development)
     - `https://your-production-domain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
6. Copy the **Client ID** and **Client Secret** to Supabase dashboard

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Click "Sign In" in the navbar
3. You should be redirected to Google OAuth consent screen
4. After authentication, you should be redirected back to your app
5. The navbar should show your email and "Sign Out" button

## How It Works

### Step-by-Step Flow

1. **User Initiates Sign-In**
   - User clicks "Sign In" button in navbar
   - `handleSignIn()` calls `signIn()` from auth context
   - `signIn()` calls `supabase.auth.signInWithOAuth()`

2. **OAuth Redirect**
   - Supabase generates PKCE code verifier and challenge
   - Browser redirects to Google OAuth consent screen
   - User authenticates with Google account

3. **Google Callback**
   - Google redirects to Supabase with authorization code
   - Supabase redirects to our callback route: `/auth/callback?code=...&next=/`

4. **Code Exchange (PKCE)**
   - Callback route extracts the authorization code
   - Calls `exchangeCodeForSession(code)` with the code verifier
   - Supabase exchanges code for access/refresh tokens
   - Session saved to HTTP-only cookies

5. **Session Established**
   - User redirected back to original page (or home)
   - Auth context's `onAuthStateChange` listener fires
   - UI updates to show authenticated state

6. **Ongoing Session Management**
   - Auth context listener monitors session changes
   - Automatically handles token refresh
   - Updates UI when user signs out or session expires

### Security Features

- **PKCE Flow**: Prevents authorization code interception attacks
- **HTTP-Only Cookies**: Session tokens stored in secure, HTTP-only cookies (not accessible via JavaScript)
- **Server-Side Validation**: All session validation happens server-side
- **Automatic Token Refresh**: Supabase handles token refresh automatically
- **CSRF Protection**: Built into Supabase's cookie management

### Session Persistence

- Sessions persist across page refreshes (stored in cookies)
- Sessions persist across browser tabs (shared cookie)
- Sessions automatically refresh when tokens expire
- Sessions are cleared when user explicitly signs out

## Troubleshooting

### Common Issues

1. **"Redirect URI mismatch" error**
   - Ensure redirect URI in Google Console matches exactly: `https://<project>.supabase.co/auth/v1/callback`
   - Check that local dev URI is also added: `http://localhost:3000/auth/callback`

2. **"Invalid client" error**
   - Verify Client ID and Secret are correctly entered in Supabase dashboard
   - Ensure Google OAuth consent screen is properly configured

3. **Session not persisting**
   - Check that cookies are enabled in browser
   - Verify environment variables are set correctly
   - Check browser console for cookie-related errors

4. **"useAuth must be used within AuthProvider" error**
   - Ensure `AuthProvider` wraps components using `useAuth()`
   - Check that `AuthProvider` is in the root layout

## Additional Resources

- [Supabase Auth Helpers for Next.js](https://github.com/supabase/auth-helpers)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)

