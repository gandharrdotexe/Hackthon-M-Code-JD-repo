## Beat the Sugar Spike – Backend

Node.js + Express + MongoDB (Mongoose) backend for frictionless sugar logging, contextual insights, and gamified habit loops.

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT-based, anonymous-first with optional email/password upgrade

### Getting Started

1. **Install dependencies**

   From the `backend` folder:

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**

   Create a `.env` file in `backend` with:

   ```bash
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/beat_sugar_spike
   JWT_SECRET=change_me_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

3. **Run the server**

   ```bash
   npm run dev
   ```

   The API will default to `http://localhost:4000`.

### Core Collections (MongoDB)

- **User**
  - `anonymousId`
  - `email` (optional)
  - `passwordHash` (optional)
  - `profile` (dob, age, height, weight, gender, bmi)
  - `gamification` (xp, level, streak, longestStreak, lastLoggedDate, badges)
  - `settings`
  - `createdAt`, `updatedAt`

- **SugarLog**
  - `userId`
  - `type` (chai, sweets, cold drink, etc.)
  - `method` (preset | photo | voice)
  - `sugarEstimate`
  - `timeOfDay`
  - `contextSnapshot` (steps, sleepHours, heartRate)
  - `generatedInsight`
  - `suggestedAction`
  - `actionCompleted`
  - `xpEarned`
  - `createdAt`

- **DailyHealthMetrics**
  - `userId`
  - `date` (YYYY-MM-DD)
  - `steps`
  - `avgHeartRate`
  - `sleepHours`

- **RewardHistory**
  - `userId`
  - `type`
  - `value`
  - `description`
  - `createdAt`

### API Overview (MVP)

- **Auth**
  - `POST /auth/anonymous` – Anonymous auth (device UUID → user + JWT)
  - `POST /auth/upgrade` – Upgrade to email/password while preserving streak/xp

- **User**
  - `GET /user/profile` – Fetch user profile and gamification
  - `PUT /user/profile` – Update profile fields
  - `GET /user/daily-status` – Returns:
    - `hasLoggedToday`
    - `streak`
    - `progressPercent`
    - `motivationalCopy`

- **Sugar Logs**
  - `POST /logs/sugar` – Fast sugar logging:
    - Validates user
    - Estimates sugar (or uses provided)
    - Fetches today’s health metrics
    - Generates **insight** (rule-based)
    - Generates **suggestion** (single action)
    - Calculates **XP**
    - Updates **streak**
    - Saves **log**
    - Returns `insight + suggestion + xp + reward`
  - `GET /logs/history?limit=20` – Recent logs for the user
  - `POST /logs/action-complete` – Mark suggested action as completed and grants extra XP

- **Health Sync**
  - `POST /health/sync` – Store daily `steps`, `avgHeartRate`, `sleepHours` for a date (used only for insights)

### Security Notes

- JWT auth required for all non-anonymous endpoints.
- Rate limiting on `/auth`, `/logs`, `/health`.
- Helmet, CORS, and JSON body parsing enabled.
- Passwords are hashed with bcrypt before storage.
- Insight/suggestion copy is **informational only** and should not be treated as medical advice.

### Hackathon Scope

This implementation covers the MVP requirements from the PRD:

- Anonymous auth
- Sugar logging
- Rule-based insight engine
- Suggestion engine
- XP + streak logic
- Variable reward system

