const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  constraints: {
    type: String,
  },
  inputFormat: {
    type: String,
  },
  outputFormat: {
    type: String,
  },
  sampleInput: {
    type: String,
  },
  sampleOutput: {
    type: String,
  },
  testCases: [
    {
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true },
      isHidden: { type: Boolean, default: false },
    },
  ],
  createdBy: {
    type: String,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Problem', problemSchema);
