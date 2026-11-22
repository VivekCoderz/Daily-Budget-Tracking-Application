const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entries');

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://daily-budget-tracker-one.vercel.app',
  process.env.CLIENT_URL,
  process.env.RENDER_EXTERNAL_URL // set by Render: same-origin requests in the single-service deploy
].filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin GET requests).
    // Any other origin must be listed: with credentials: true, allowing every origin
    // would let any website make authenticated requests with the user's cookie.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// Production Static File Serving (Serve built React client dist)
const clientDistPath = path.join(__dirname, '../client/dist');
if (process.env.NODE_ENV === 'production' || require('fs').existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next(); // unknown API route -> 404 instead of hanging
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/budgettracker';

// Connect to MongoDB & Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️ Starting server without MongoDB connection (Retrying in background)...');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (MongoDB offline mode)`);
    });
  });
