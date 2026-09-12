const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const excelRoutes = require('./routes/excelRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// CORS CONFIGURATION
// =========================

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // Example: Postman, Render health checks
      if (!origin) {
        return callback(null, true);
      }

      // Allow local React frontend
      if (origin === 'http://localhost:3000') {
        return callback(null, true);
      }

      // Allow all Vercel deployment URLs
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      console.log('Blocked by CORS:', origin);

      return callback(new Error('Not allowed by CORS'));
    },

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],

    credentials: true,
  })
);

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());

// =========================
// TEST ROUTE
// =========================

app.get('/', (req, res) => {
  res.json({
    message: 'Excel Analytics API is running',
  });
});

// =========================
// API ROUTES
// =========================

app.use('/api/auth', authRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/admin', adminRoutes);

// =========================
// DATABASE CONNECTION
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      '❌ MongoDB connection error:',
      err.message
    );
  });