# Calorie Tracker - Iteration 1: Project Foundation

## Overview

This is Iteration 1 of the Personal Calorie Tracker application. The project foundation has been established with all necessary tooling and configuration.

## ✅ Completed Tasks

- [x] Create Next.js project with App Router
- [x] Configure TypeScript
- [x] Configure Tailwind CSS for styling
- [x] Configure ESLint for code linting
- [x] Configure Prettier for code formatting
- [x] Setup MongoDB Atlas environment configuration
- [x] Setup Vercel deployment configuration
- [x] Configure environment variables (.env.example)
- [x] Create application layout with dark mode support
- [x] Create bottom navigation component

## 📂 Project Structure

```
intake/
├── app/
│   ├── layout.tsx           # Root layout with Navigation
│   ├── page.tsx             # Home page
│   ├── entry/
│   │   └── new/page.tsx     # Add entry page (placeholder)
│   ├── stats/page.tsx       # Statistics page (placeholder)
│   ├── weight/page.tsx      # Weight tracking page (placeholder)
│   └── profile/page.tsx     # Profile page (placeholder)
├── components/
│   └── Navigation.tsx       # Bottom navigation bar
├── public/                  # Static assets
├── docs/
│   ├── requirements.md      # Application requirements
│   └── roadmap.md          # Development roadmap
├── .env.example            # Environment variables template
├── .eslintrc.json         # ESLint configuration
├── .prettierrc             # Prettier configuration
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your configuration:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `GOOGLE_ID` and `GOOGLE_SECRET` - Google OAuth credentials
   - `NEXTAUTH_SECRET` - Random secret key (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` - Your application URL

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting with Prettier

## 🔧 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Code Quality**: ESLint, Prettier
- **Database**: MongoDB Atlas
- **Authentication**: Auth.js (NextAuth) with Google OAuth
- **Hosting**: Vercel
- **Charts**: Recharts (to be installed in later iterations)

## 📋 Features

### Implemented
- ✓ Responsive layout with dark mode support
- ✓ Bottom navigation bar with placeholder pages
- ✓ TypeScript strict mode enabled
- ✓ ESLint and Prettier configured
- ✓ Environment configuration ready

### Coming Next (Iteration 2)
- [ ] Google OAuth authentication
- [ ] Email whitelist protection
- [ ] Protected routes
- [ ] Login/logout flow

## 📝 Notes

- The application is mobile-first focused
- Dark mode is fully supported
- All styles use Tailwind CSS for consistency
- Code formatting is enforced with Prettier
- ESLint ensures code quality

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Deployment](https://vercel.com)

## 📚 Development Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the complete development roadmap.

---

**Status**: ✅ Iteration 1 Complete - Application foundation is deployed and ready for authentication setup.
