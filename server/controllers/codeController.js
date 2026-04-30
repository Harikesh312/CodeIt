const { runCode, runCodeWithTestCases } = require('../utils/codeRunner');
const Room = require('../models/Room');
const Problem = require('../models/Problem');

const executeCode = async (req, res, next) => {
  try {
    const { language, code, roomId } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required' });
    }

    const result = await runCode(language, code);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const runTests = async (req, res, next) => {
  try {
    const { language, code, roomId, problemId } = req.body;

    if (!language || !code || !problemId) {
      return res.status(400).json({ error: 'Language, code, and problemId are required' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({ error: 'No test cases found for this problem' });
    }

    const results = await runCodeWithTestCases(language, code, problem.testCases);
    res.json(results);
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
  runTests,
  submitCode,
};
