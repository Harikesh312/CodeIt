const Problem = require('../models/Problem');

const createProblem = async (req, res, next) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Only HR can create problems' });
    }

    const { title, description, difficulty, constraints, inputFormat, outputFormat, sampleInput, sampleOutput, testCases, roomId } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ error: 'At least one test case is required' });
    }

    const problem = new Problem({
      title,
      description,
      difficulty: difficulty || 'Medium',
      constraints,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      testCases,
      roomId,
      createdBy: req.user.name,
    });

    await problem.save();

    // Emit socket event if io is available on the request (set by middleware)
    if (req.app.get('io') && roomId) {
      req.app.get('io').to(roomId.toString()).emit('problem_updated', problem);
    }

    res.status(201).json(problem);
  } catch (error) {
    next(error);
  }
};

const getProblemsByRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const problems = await Problem.find({ roomId }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Only HR can update problems' });
    }

    const { id } = req.params;
    const { title, description, difficulty, constraints, inputFormat, outputFormat, sampleInput, sampleOutput, testCases } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (title) problem.title = title;
    if (description) problem.description = description;
    if (difficulty) problem.difficulty = difficulty;
    if (constraints !== undefined) problem.constraints = constraints;
    if (inputFormat !== undefined) problem.inputFormat = inputFormat;
    if (outputFormat !== undefined) problem.outputFormat = outputFormat;
    if (sampleInput !== undefined) problem.sampleInput = sampleInput;
    if (sampleOutput !== undefined) problem.sampleOutput = sampleOutput;
    if (testCases) problem.testCases = testCases;

    await problem.save();

    // Emit socket event for real-time update
    if (req.app.get('io') && problem.roomId) {
      req.app.get('io').to(problem.roomId.toString()).emit('problem_updated', problem);
    }

    res.json(problem);
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Only HR can delete problems' });
    }

    const { id } = req.params;
    const problem = await Problem.findByIdAndDelete(id);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Notify room that problem was removed
    if (req.app.get('io') && problem.roomId) {
      req.app.get('io').to(problem.roomId.toString()).emit('problem_updated', null);
    }

    res.json({ success: true, message: 'Problem deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProblem,
  getProblemsByRoom,
  updateProblem,
  deleteProblem,
};
