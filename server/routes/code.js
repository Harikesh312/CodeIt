const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const auth = require('../middleware/auth');

// POST /api/code/run
router.post('/run', auth, codeController.executeCode);

// POST /api/code/run-tests
router.post('/run-tests', auth, codeController.runTests);

// POST /api/code/submit
router.post('/submit', auth, codeController.submitCode);

module.exports = router;
