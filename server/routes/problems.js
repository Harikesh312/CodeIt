const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const auth = require('../middleware/auth');

// POST /api/problems — Create a new problem (HR only)
router.post('/', auth, problemController.createProblem);

// GET /api/problems/room/:roomId — Get all problems for a room
router.get('/room/:roomId', auth, problemController.getProblemsByRoom);

// PUT /api/problems/:id — Update a problem (HR only)
router.put('/:id', auth, problemController.updateProblem);

// DELETE /api/problems/:id — Delete a problem (HR only)
router.delete('/:id', auth, problemController.deleteProblem);

module.exports = router;
