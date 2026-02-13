# Deployment Guide

This guide covers deploying the Beat the Sugar Spike application to production.

## Deployment URLs

- **Frontend (Vercel)**: https://hackthon-m-code-jd-repo.vercel.app/
- **Backend (Render)**: https://hackthon-m-code-jd-repo.onrender.com

---

## Frontend Deployment (Vercel)

### Environment Variables

Set the following environment variable in your Vercel project settings (Settings > Environment Variables):

```
NEXT_PUBLIC_API_URL=https://hackthon-m-code-jd-repo.onrender.com
```

### Steps

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend` (if deploying from monorepo)
3. Add the environment variable above
4. Deploy

The frontend will automatically use the production backend URL when `NEXT_PUBLIC_API_URL` is set.

---

## Backend Deployment (Render)

### Environment Variables

Set the following environment variables in your Render dashboard (Environment tab):

```
PORT=10000
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<strong-random-secret-string>
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://hackthon-m-code-jd-repo.vercel.app
```

### Steps

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `backend` (if deploying from monorepo)
4. Build command: `npm install`
5. Start command: `node src/server.js` or `npm start`
6. Add all environment variables listed above
7. Deploy

### MongoDB Setup

For production, use MongoDB Atlas:

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Replace `<password>` with your database user password
4. Add the connection string to `MONGO_URI` environment variable

Example connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/beat_sugar_spike?retryWrites=true&w=majority
```

---

## Local Development

### Frontend

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend

Create a `.env` file in the `backend` directory:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/beat_sugar_spike
JWT_SECRET=dev_secret_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## CORS Configuration

The backend is configured to accept requests from:
- Production: `https://hackthon-m-code-jd-repo.vercel.app`
- Local development: `http://localhost:3000` (when `NODE_ENV=development`)

This is controlled by the `FRONTEND_URL` environment variable in the backend.

---

## Testing Production Deployment

1. **Health Check**: Visit `https://hackthon-m-code-jd-repo.onrender.com/healthz`
   - Should return: `{"status":"ok"}`

2. **Frontend**: Visit `https://hackthon-m-code-jd-repo.vercel.app/`
   - Should load the application
   - API calls should connect to the Render backend

3. **Test Anonymous Login**: 
   - Open browser console
   - The app should successfully authenticate and connect to the backend

---

## Troubleshooting

### Frontend can't connect to backend

- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check backend health endpoint is accessible
- Verify CORS is configured correctly in backend

### Backend CORS errors

- Ensure `FRONTEND_URL` environment variable matches your Vercel URL exactly
- Check that the backend is using the production environment variable

### MongoDB connection issues

- Verify `MONGO_URI` is correctly formatted
- Ensure MongoDB Atlas IP whitelist includes Render's IPs (or use `0.0.0.0/0` for development)
- Check database user has correct permissions
