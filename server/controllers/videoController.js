// node-fetch v3 is ESM-only — use dynamic import
let fetch;
const getFetch = async () => {
  if (!fetch) {
    const mod = await import('node-fetch');
    fetch = mod.default;
  }
  return fetch;
};
const Room = require('../models/Room');

const createVideoRoom = async (req, res, next) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({ error: 'roomCode is required' });
    }

    const room = await Room.findOne({ code: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.dailyRoomUrl) {
      return res.json({ url: room.dailyRoomUrl, roomName: room.dailyRoomName });
    }

    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    if (!DAILY_API_KEY || DAILY_API_KEY === 'your_daily_api_key_here') {
      // Fallback to Jitsi if no valid key is provided
      const jitsiUrl = `https://meet.jit.si/CodeIt-${roomCode}`;
      room.dailyRoomUrl = jitsiUrl;
      room.dailyRoomName = `CodeIt-${roomCode}`;
      await room.save();
      return res.json({ url: jitsiUrl, roomName: room.dailyRoomName });
    }

    const roomName = `codeit-${roomCode.toLowerCase()}`;

    const fetch = await getFetch();
    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          exp: Math.floor(Date.now() / 1000) + 10800, // 3 hours from now
          enable_chat: true,
          enable_screenshare: true,
          start_video_off: false,
          start_audio_off: false,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Daily.co API Error: ${errorData.error || response.statusText}`);
    }

    const dailyRoom = await response.json();

    room.dailyRoomUrl = dailyRoom.url;
    room.dailyRoomName = dailyRoom.name;
    await room.save();

    res.json({ url: dailyRoom.url, roomName: dailyRoom.name });
  } catch (error) {
    next(error);
  }
};

const deleteVideoRoom = async (req, res, next) => {
  try {
    const { roomName } = req.params;
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    // We can clean up DB even if there's no API key (e.g. jitsi fallback)
    const room = await Room.findOne({ dailyRoomName: roomName });
    if (room) {
      room.dailyRoomUrl = undefined;
      room.dailyRoomName = undefined;
      await room.save();
    }

    if (DAILY_API_KEY && DAILY_API_KEY !== 'your_daily_api_key_here' && roomName.startsWith('codeit-')) {
      const fetch = await getFetch();
      const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to delete Daily.co room', await response.text());
      }
    }

    res.json({ success: true, message: 'Room deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVideoRoom,
  deleteVideoRoom,
};
