require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const socketHandler = require('./socket/socketHandler');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const codeRoutes = require('./routes/code');
const videoRoutes = require('./routes/video');
const problemRoutes = require('./routes/problems');

// Allowed origins – always include localhost for dev, plus any production CLIENT_URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://codeit-vzw0.onrender.com',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

function corsOriginCheck(origin, callback) {
  // Allow all origins in development to prevent 'Failed to fetch' errors
  return callback(null, true);
}

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Make io accessible to controllers via req.app.get('io')
app.set('io', io);

// Attach Socket handler
socketHandler(io);

// Middleware
app.use(cors({
  origin: corsOriginCheck,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/problems', problemRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
