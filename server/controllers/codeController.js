const { runCode } = require('../utils/codeRunner');
const Room = require('../models/Room');

const executeCode = async (req, res, next) => {
  try {
    const { language, code, roomId } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required' });
    }

    const result = await runCode(language, code);
    
    // Optionally log this execution in the Session model, but that might be better handled by socket event.
    // However, the spec says "POST /api/code/run ... Action: Map language... POST to Piston... Return formatted result".
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const submitCode = async (req, res, next) => {
  try {
    const { language, code, roomId } = req.body;

    if (!language || !code || !roomId) {
      return res.status(400).json({ error: 'Language, code, and roomId are required' });
    }

    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    room.submissions.push({
      code,
      language,
      submittedBy: req.user.name,
    });

    await room.save();

    res.json({
      success: true,
      message: 'Code submitted successfully',
      submissionId: room.submissions[room.submissions.length - 1]._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  executeCode,
  submitCode,
};
