# Personal Calorie Tracker - Requirements

## Overview

Personal calorie tracking application designed for two users.

The application should provide a fast and frictionless way to track daily calorie intake, monitor body weight, and visualize historical trends.

The primary focus is usability, simplicity, and mobile-first experience.

---

# Goals

* Fast calorie logging
* Minimal number of clicks
* Mobile-first experience
* Shared application for two users
* Historical calorie analytics
* Weight tracking
* Production-quality codebase
* Cloud deployment

---

# Technology Stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

## Backend

* Next.js Route Handlers
* Server Actions

## Database

* MongoDB Atlas

## Authentication

* Google OAuth (Auth.js / NextAuth)

## Charts

* Recharts

## Hosting

* Vercel

---

# Functional Requirements

## Authentication

Users authenticate using Google OAuth.

Only whitelisted email addresses may access the application.

No public registration is required.

---

## User Profiles

Each user contains:

* Name
* Daily calorie target

Users can switch between profiles.

---

## Calorie Entries

Each entry contains:

* User ID
* Food name
* Calories per 100g
* Weight in grams
* Calculated calories
* Optional meal tag
* Created timestamp
* Updated timestamp

Meal tags:

* Breakfast
* Lunch
* Dinner
* Snack

Calories are calculated automatically.

---

## Dashboard

Display:

* Current date
* Calories consumed
* Daily target
* Remaining calories
* Progress bar
* Daily food log

Actions:

* Add entry
* Edit entry
* Delete entry

---

## Recent Foods

Display recently used foods.

Allow users to quickly create a new entry based on a previous one.

---

## Weight Tracking

Each weight entry contains:

* User ID
* Weight (kg)
* Timestamp

Display:

* Current weight
* Weight history
* Weight trend chart

---

## Statistics

Display:

### Calorie Statistics

* Daily totals
* 7-day average
* 30-day average
* Last 7 days chart
* Last 30 days chart

### Weight Statistics

* Weight history chart
* Weight trend chart

---

# Non-Functional Requirements

## Mobile First

Application must be optimized for smartphones.

Requirements:

* Responsive layout
* Large touch targets
* Fast interactions

## Performance

* Fast page loads
* Optimized database queries
* Minimal client-side state

## Accessibility

* Keyboard accessible
* Proper labels
* High contrast support

## Dark Mode

Full dark mode support.

---

# Navigation

Bottom navigation bar:

* Dashboard
* Add Entry
* Statistics
* Weight

---

# DevOps Requirements

## Source Control

* GitHub

## Containerization

* Dockerfile
* docker-compose

## CI/CD

GitHub Actions:

* Lint
* Test
* Build

## Deployment

Automatic deployment to Vercel.

---

# Out of Scope (Future Versions)

* Barcode scanner
* AI food recognition
* Macro tracking
* Offline mode
* Public registration
* Social features
