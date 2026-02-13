const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Basic security & parsing
app.use(helmet());

// CORS configuration - allow production and development origins
const allowedOrigins = [
  'https://hackthon-m-code-jd-repo.vercel.app',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200
});
app.use('/auth', apiLimiter);
app.use('/logs', apiLimiter);
app.use('/health', apiLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/logs', logRoutes);
app.use('/health', healthRoutes);

// Health check
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

// 404 & error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/beat_sugar_spike';

connectDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  });

