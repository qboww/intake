# Calorie Tracker - Iteration 2: Authentication

## Overview

Iteration 2 implements Google OAuth authentication with email whitelist protection. Only approved users can access the application.

## ✅ Completed Features

### 1. Auth.js Integration
- [x] Installed Auth.js v5 (next-auth) with Google provider
- [x] Configured JWT session strategy
- [x] Set up NextAuth route handler at `/api/auth/[...nextauth]`

### 2. Google OAuth Configuration
- [x] Google provider setup in `lib/auth.ts`
- [x] OAuth callback handling
- [x] Automatic user profile detection (name, email, image)

### 3. Email Whitelist System
- [x] Email whitelist module at `lib/whitelist.ts`
- [x] Email validation during authentication
- [x] Whitelist-based access control

### 4. Protected Routes
- [x] Middleware protection (`middleware.ts`)
- [x] Automatic redirect to login for unauthenticated users
- [x] Email whitelist validation in middleware

### 5. Authentication Pages
- [x] Login page at `/auth/login` with Google OAuth button
- [x] Error page at `/auth/error` for unauthorized access
- [x] Suspense boundary for client-side components

### 6. User Session Management
- [x] SessionProvider setup in `app/providers.tsx`
- [x] Session persistence using JWT tokens
- [x] 30-day session expiration

### 7. User Interface Updates
- [x] User menu in top-right corner showing:
  - User profile picture
  - User name
  - User email in dropdown
  - Sign out button
- [x] Navigation hidden on auth pages
- [x] Responsive design for mobile

## 📂 Project Structure

```
auth.ts                          # NextAuth configuration export
middleware.ts                    # Route protection middleware
lib/
  ├── auth.ts                   # Auth configuration with Google provider
  └── whitelist.ts              # Email whitelist validation
app/
  ├── providers.tsx             # SessionProvider wrapper
  ├── layout.tsx                # Updated with SessionProvider
  ├── api/
  │   └── auth/[...nextauth]/
  │       └── route.ts          # Auth route handler
  └── auth/
      ├── layout.tsx            # Auth pages layout
      ├── login/
      │   └── page.tsx          # Google OAuth login page
      └── error/
          └── page.tsx          # Unauthorized access page
components/
  └── Navigation.tsx            # Updated with user menu and logout
```

## 🔧 Setup Instructions

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update `.env.local` with your values:
```env
# Google OAuth (create at https://console.cloud.google.com/)
GOOGLE_ID=your_google_oauth_client_id
GOOGLE_SECRET=your_google_oauth_client_secret

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_random_secret_key_here

# Local development
NEXTAUTH_URL=http://localhost:3000

# MongoDB (will be used in Iteration 3)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database_name
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application):
   - Authorized JavaScript origins: `http://localhost:3000`, `https://your-vercel-url.vercel.app`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret to `.env.local`

### 3. Configure Email Whitelist

Edit `lib/whitelist.ts` and add approved email addresses:
```typescript
export const EMAIL_WHITELIST: string[] = [
  'user1@example.com',
  'user2@example.com',
];
```

### 4. Test Authentication

Start the development server:
```bash
npm run dev
```

Visit http://localhost:3000:
- You should be redirected to login page
- Click "Sign in with Google"
- If your email is whitelisted, you'll be authenticated
- If not, you'll see the error page

## 🔐 Security Features

### Email Whitelist Protection
- Only whitelisted emails can access the application
- Checked during authentication callback
- Checked in middleware for extra protection
- Case-insensitive email comparison

### Session Management
- JWT-based sessions (stateless, scalable)
- 30-day session expiration
- Secure cookie storage
- Automatic token refresh

### Protected Routes
- Middleware intercepts all requests except:
  - `/api/auth/*` (authentication endpoints)
  - `/_next/*` (Next.js internal)
  - `/public/*` (public assets)
  - `/favicon.ico`
- Unauthorized users redirected to login

## 🎨 User Experience

### Login Flow
1. User visits application
2. Redirected to `/auth/login` if not authenticated
3. Clicks "Sign in with Google"
4. Approves OAuth consent
5. Redirected to dashboard or original page

### Logout Flow
1. Click user menu (top-right corner)
2. Click "Sign Out"
3. Session cleared
4. Redirected to login page

### Error Handling
- Whitelisted users: Full access
- Non-whitelisted users: Error page with message
- Network errors: Graceful error messages

## 📝 Authentication Flow Diagram

```
┌─────────────────────┐
│   Unauthenticated   │
│      User           │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ /auth/login  │
    │ (Google OAuth│
    │  Button)     │
    └──────┬───────┘
           │
           ▼
┌──────────────────────┐
│ Google OAuth Server  │
│ (user signs in)      │
└──────────┬───────────┘
           │
           ▼
    ┌─────────────────┐
    │ Email Whitelist │
    │ Check           │
    └────┬────────┬───┘
         │        │
    Approved  Not Approved
         │        │
         ▼        ▼
      Dashboard  /auth/error
```

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `GOOGLE_ID`
   - `GOOGLE_SECRET`
   - `NEXTAUTH_SECRET`
   - `MONGODB_URI`
4. Update Google OAuth redirect URIs to include Vercel URL
5. Deploy automatically on push

### Production Checklist

- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Update Google OAuth redirect URIs
- [ ] Use strong `NEXTAUTH_SECRET` (32+ bytes)
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Test email whitelist with production emails
- [ ] Set up email notifications for failed logins (Iteration 9+)

## 🔗 Related Documentation

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Auth.js Documentation](https://authjs.dev/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth Environment Variables](https://authjs.dev/getting-started/deployment)

## 📊 Testing Scenarios

### Scenario 1: Whitelisted User
✅ Email in whitelist → Access granted → Dashboard

### Scenario 2: Non-whitelisted User
❌ Email not in whitelist → Error page → Access denied

### Scenario 3: Session Expiration
⏱️ After 30 days → Session expires → Redirect to login

### Scenario 4: Network Error
🔴 Network issue during sign-in → Error message shown

## 🎯 Next Steps

### Iteration 3 - Database & Core Models
- [ ] MongoDB connection setup
- [ ] User model creation
- [ ] Entry model creation
- [ ] WeightEntry model creation
- [ ] Repository layer implementation

---

**Status**: ✅ Iteration 2 Complete - Application is now protected with Google OAuth and email whitelist.
