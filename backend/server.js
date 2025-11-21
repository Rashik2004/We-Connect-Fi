require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cron = require('node-cron');
const connectDB = require('./src/config/database');
const socketHandler = require('./src/socket/socketHandler');
const wifiService = require('./src/services/wifiService');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://agent-69206fdc35d33f166c759--calm-crumble-376a38.netlify.app/',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize Socket.IO handlers
socketHandler(io);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://agent-69206fdc35d33f166c759--calm-crumble-376a38.netlify.app/',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api', limiter);

// Serve static files (avatars, uploads)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/friends', require('./src/routes/friends'));
app.use('/api/wifi', require('./src/routes/wifi'));
app.use('/api/messages', require('./src/routes/messages'));
app.use('/api/settings', require('./src/routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'We-Connect-Fi API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Cron jobs
// Cleanup inactive WiFi groups every hour
cron.schedule('0 * * * *', async () => {
  console.log('🔄 Running WiFi group cleanup...');
  try {
    await wifiService.cleanupInactiveGroups();
  } catch (error) {
    console.error('Error in cleanup cron job:', error);
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Server closed');
    process.exit(0);
  });
});
