const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');

// GET /api/rooms
router.get('/', auth, roomController.getRooms);

// POST /api/rooms
router.post('/', auth, roomController.createRoom);

// GET /api/rooms/:id
router.get('/:id', auth, roomController.getRoomById);

// GET /api/rooms/code/:code
// Public or requires simple auth? Typically joining by code requires being authenticated as a candidate.
// Adding auth middleware as requested
router.get('/code/:code', auth, roomController.getRoomByCode);

// PATCH /api/rooms/:id/status
router.patch('/:id/status', auth, roomController.updateRoomStatus);

module.exports = router;
