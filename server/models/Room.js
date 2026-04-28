const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  candidate: {
    type: String,
  },
  duration: {
    type: Number,
    default: 60,
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'cancelled'],
    default: 'waiting',
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
  },
  dailyRoomUrl: {
    type: String,
  },
  dailyRoomName: {
    type: String,
  },
  currentCode: {
    type: String,
    default: '',
  },
  currentLanguage: {
    type: String,
    default: 'javascript',
  },
  submissions: [
    {
      code: String,
      language: String,
      submittedAt: {
        type: Date,
        default: Date.now,
      },
      submittedBy: String,
    },
  ],
});

module.exports = mongoose.model('Room', roomSchema);
