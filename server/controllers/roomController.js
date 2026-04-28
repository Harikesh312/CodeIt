const Room = require('../models/Room');

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const getRooms = async (req, res, next) => {
  try {
    // Only HR can list all their rooms
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Only HR can list rooms' });
    }

    const rooms = await Room.find({ createdBy: req.user.name }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Only HR can create rooms' });
    }

    const { title, candidate, duration } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Room title is required' });
    }

    let code;
    let isUnique = false;
    while (!isUnique) {
      code = generateRoomCode();
      const existing = await Room.findOne({ code });
      if (!existing) isUnique = true;
    }

    const room = new Room({
      code,
      title,
      candidate,
      duration: duration || 60,
      createdBy: req.user.name,
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    next(error);
  }
};

const getRoomByCode = async (req, res, next) => {
  try {
    const room = await Room.findOne({ code: req.params.code.toUpperCase() });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    next(error);
  }
};

const updateRoomStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['waiting', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    room.status = status;
    if (status === 'active' && !room.startedAt) {
      room.startedAt = new Date();
    } else if (status === 'completed' || status === 'cancelled') {
      room.endedAt = new Date();
    }

    await room.save();
    res.json(room);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  createRoom,
  getRoomById,
  getRoomByCode,
  updateRoomStatus,
};
