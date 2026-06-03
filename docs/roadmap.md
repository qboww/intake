# Personal Calorie Tracker - Development Roadmap

## Iteration 1 - Project Foundation

Goal: Deploy a working application skeleton.

Tasks:

* Create Next.js project
* Configure TypeScript
* Configure Tailwind
* Configure ESLint
* Configure Prettier
* Setup MongoDB Atlas
* Setup Vercel deployment
* Configure environment variables
* Create application layout
* Create bottom navigation

Deliverable:

Application is deployed and accessible.

---

## Iteration 2 - Authentication

Goal: Restrict application access.

Tasks:

* Setup Auth.js (NextAuth)
* Configure Google OAuth
* Implement email whitelist
* Create protected routes
* Create login flow
* Create logout flow

Deliverable:

Only approved users can access the application.

---

## Iteration 3 - Database & Core Models

Goal: Establish data layer.

Tasks:

* Create User model
* Create Entry model
* Create WeightEntry model
* Configure MongoDB connection
* Create repository/service layer

Deliverable:

Application can persist data.

---

## Iteration 4 - Calorie Tracking MVP

Goal: First usable version.

Tasks:

* Add entry form
* Calorie calculator
* Entry validation
* Create entry API
* Daily entry list
* Delete entry
* Edit entry

Deliverable:

Daily calorie tracking fully functional.

---

## Iteration 5 - Dashboard

Goal: Improve daily usability.

Tasks:

* Daily summary
* Remaining calories
* Progress bar
* User switcher
* Daily totals

Deliverable:

Complete dashboard experience.

---

## Iteration 6 - Recent Foods

Goal: Reduce friction.

Tasks:

* Recent foods query
* Quick-add functionality
* Duplicate previous entry flow

Deliverable:

Food logging becomes significantly faster.

---

## Iteration 7 - Statistics

Goal: Historical insights.

Tasks:

* Daily aggregation
* Weekly averages
* Monthly averages
* Recharts integration
* 7-day chart
* 30-day chart

Deliverable:

Historical calorie analytics available.

---

## Iteration 8 - Weight Tracking

Goal: Track physical progress.

Tasks:

* Weight entry form
* Weight history list
* Weight chart
* Weight trend calculation

Deliverable:

Users can track body weight over time.

---

## Iteration 9 - UX Improvements ⏭️ (Skipped for now)

Goal: Polish application.

Tasks:

* Dark mode toggle
* Loading states
* Empty states
* Error handling
* Responsive improvements
* Animations

Deliverable:

Production-ready user experience. (Deferred)

---

## Iteration 10 - DevOps & Vercel Deployment 🚀 (In Progress)

Goal: Deploy application and establish portfolio readiness.

Tasks:

* ✅ vercel.json configuration
* Deploy to Vercel
* Environment variables setup
* MongoDB Atlas whitelist
* Google OAuth redirect URIs
* Production testing
* Custom domain setup (optional)

Deliverable:

Live production deployment on Vercel suitable for portfolio.
