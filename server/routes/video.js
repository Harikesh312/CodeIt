const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');

// POST /api/video/room
router.post('/room', auth, videoController.createVideoRoom);

// DELETE /api/video/room/:roomName
router.delete('/:roomName', auth, videoController.deleteVideoRoom);

module.exports = router;
