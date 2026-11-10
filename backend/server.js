const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./src/config/db');
const scanRoutes = require('./src/routes/scanRoutes');
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (with automatic graceful in-memory fallback)
connectDB();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Cyber Security Hosting & Tech Checker Engine',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', scanRoutes);

// Centralized Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Cyber Hosting Checker Engine Running on Port ${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api/scan?domain=github.com`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
