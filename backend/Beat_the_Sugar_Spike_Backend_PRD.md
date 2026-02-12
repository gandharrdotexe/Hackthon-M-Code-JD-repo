# Beat the Sugar Spike -- Backend PRD

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB (Mongoose)
-   JWT Authentication
-   Optional ML Microservice

------------------------------------------------------------------------

# 1. Product Overview

## Purpose

Build a backend system that enables: - Anonymous, frictionless
onboarding - Fast sugar event logging (\<10 sec) - Context-aware insight
generation - Personalized corrective suggestions - Gamified streak &
reward system - Optional upgrade to full signup - ML-driven
personalization (extensible)

------------------------------------------------------------------------

# 2. High-Level Architecture

Client (Web/App) ↓ Express API Layer ↓ Business Logic Layer (Services) ↓
MongoDB (Mongoose ODM) ↓ ML / Rule Engine

------------------------------------------------------------------------

# 3. Core Backend Modules

-   Auth Module
-   User Module
-   Sugar Log Module
-   Health Sync Module
-   Insight Engine
-   Suggestion Engine
-   Gamification Engine
-   Reward Engine
-   Notification Module
-   Analytics Module

------------------------------------------------------------------------

# 4. Database Design

## User Collection

-   anonymousId
-   email (optional)
-   passwordHash (optional)
-   profile (dob, age, height, weight, gender, bmi)
-   gamification (xp, level, streak, longestStreak, lastLoggedDate,
    badges)
-   settings
-   createdAt
-   updatedAt

## SugarLog Collection

-   userId
-   type (chai, sweets, cold drink etc.)
-   method (preset \| photo \| voice)
-   sugarEstimate
-   timeOfDay
-   contextSnapshot (steps, sleepHours, heartRate)
-   generatedInsight
-   suggestedAction
-   actionCompleted
-   xpEarned
-   createdAt

## DailyHealthMetrics Collection

-   userId
-   date
-   steps
-   avgHeartRate
-   sleepHours

## RewardHistory Collection

-   userId
-   type
-   value
-   description
-   createdAt

------------------------------------------------------------------------

# 5. Authentication Strategy

## Anonymous Authentication

POST /auth/anonymous

-   Client sends device UUID
-   Backend creates anonymous user
-   Returns JWT

## Optional Signup Upgrade

POST /auth/upgrade

-   Converts anonymous account
-   Preserves streak and XP

------------------------------------------------------------------------

# 6. Fast Sugar Logging Flow

POST /logs/sugar

Flow: 1. Validate user 2. Estimate sugar grams 3. Fetch today's health
metrics 4. Generate insight 5. Generate suggestion 6. Calculate XP 7.
Update streak 8. Save log 9. Return insight + XP + reward

------------------------------------------------------------------------

# 7. Insight Engine

Hybrid approach: - Rule-based (MVP) - ML-ready (extensible)

Sample rule: - If sleep \< 6 and sugar logged at night → insight about
recovery impact - If low steps + afternoon sugar → energy stability
insight

------------------------------------------------------------------------

# 8. Suggestion Engine

Rules: - Only ONE primary action - Immediate and doable - Context-aware

Examples: - 10-minute walk - Drink water - Protein snack swap

------------------------------------------------------------------------

# 9. Gamification Engine

## Streak Logic

-   Compare lastLoggedDate
-   Increment if consecutive
-   Reset if missed

## XP Model

-   Log sugar: +2
-   Log before 6PM: +3
-   Complete action: +7
-   3-day streak: +5
-   Surprise bonus: 2--10

## Variable Rewards

Weighted random reward engine to create curiosity.

------------------------------------------------------------------------

# 10. Daily Ritual System

GET /user/daily-status

Returns: - Has logged today - Current streak - Progress % - Motivational
copy

------------------------------------------------------------------------

# 11. Health Sync

POST /health/sync

-   Store passive metrics
-   Never expose raw biometric values
-   Use only for insights

------------------------------------------------------------------------

# 12. API Overview

-   POST /auth/anonymous
-   POST /auth/upgrade
-   GET /user/profile
-   PUT /user/profile
-   POST /logs/sugar
-   GET /logs/history
-   POST /health/sync
-   GET /user/daily-status
-   POST /logs/action-complete

------------------------------------------------------------------------

# 13. Security

-   JWT authentication
-   Rate limiting
-   Input validation
-   Helmet middleware
-   bcrypt password hashing
-   No medical claims in insights

------------------------------------------------------------------------

# 14. Scalability

-   Index on userId and createdAt
-   Aggregation for streak queries
-   Optional Redis for caching streaks

------------------------------------------------------------------------

# 15. Hackathon MVP Scope

Must Build: - Anonymous auth - Sugar logging - Insight engine
(rule-based) - Suggestion engine - XP + streak logic - Variable reward
system

Optional: - ML microservice - Photo/voice logging - Push notifications

------------------------------------------------------------------------

# Final Outcome

The backend enables: - Frictionless sugar tracking - Real-time
contextual insights - Gamified habit loops - ML-ready personalization -
Scalable production architecture
