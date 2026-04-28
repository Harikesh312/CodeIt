const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  roomCode: {
    type: String,
    required: true,
  },
  events: [
    {
      type: {
        type: String,
        enum: ['join', 'leave', 'code_change', 'run', 'submit', 'timer'],
      },
      user: String,
      data: mongoose.Schema.Types.Mixed,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', sessionSchema);
