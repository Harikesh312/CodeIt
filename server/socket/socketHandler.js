const Room = require('../models/Room');
const Session = require('../models/Session');
const { runCode } = require('../utils/codeRunner');

const socketHandler = (io) => {
  // To keep track of users and their rooms
  // socket.id -> { roomId, user: { name, role } }
  const socketToUser = new Map();

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Helper to log events to Session
    const logEvent = async (roomId, type, user, data = {}) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) return;

        let session = await Session.findOne({ roomId });
        if (!session) {
          session = new Session({ roomId, roomCode: room.code, events: [] });
        }

        session.events.push({
          type,
          user: user?.name || 'system',
          data,
        });

        await session.save();
      } catch (error) {
        console.error('Error logging session event:', error);
      }
    };

    socket.on('join_room', async ({ roomId, user }) => {
      socket.join(roomId);
      socketToUser.set(socket.id, { roomId, user });

      try {
        const room = await Room.findById(roomId);
        if (room) {
          if (room.status === 'waiting') {
            room.status = 'active';
            room.startedAt = new Date();
            await room.save();
          }
        }

        socket.to(roomId).emit('participant_joined', {
          id: socket.id,
          name: user.name,
          role: user.role,
          online: true,
        });

        await logEvent(roomId, 'join', user);
      } catch (error) {
        console.error('join_room error:', error);
      }
    });

    socket.on('leave_room', async ({ roomId }) => {
      socket.leave(roomId);
      const userData = socketToUser.get(socket.id);
      socketToUser.delete(socket.id);

      socket.to(roomId).emit('participant_left', { id: socket.id });
      if (userData) {
        await logEvent(roomId, 'leave', userData.user);
      }
    });

    // Debounce code save manually (simple implementation)
    let saveTimeout;
    socket.on('code_change', async ({ code, roomId }) => {
      socket.to(roomId).emit('code_change', { code });

      const userData = socketToUser.get(socket.id);
      
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        try {
          await Room.findByIdAndUpdate(roomId, { currentCode: code });
          if (userData) {
             await logEvent(roomId, 'code_change', userData.user, { length: code.length });
          }
        } catch (error) {
          console.error('code_change save error:', error);
        }
      }, 5000);
    });

    socket.on('language_change', async ({ language, roomId }) => {
      socket.to(roomId).emit('language_change', { language });

      try {
        await Room.findByIdAndUpdate(roomId, { currentLanguage: language.id || language });
      } catch (error) {
        console.error('language_change error:', error);
      }
    });

    socket.on('run_code', async ({ language, code, roomId }) => {
      const userData = socketToUser.get(socket.id);
      try {
        // Run code via piston
        const result = await runCode(language, code);
        
        // Emit output back to everyone in the room
        io.to(roomId).emit('code_output', result);

        await logEvent(roomId, 'run', userData?.user, { language, error: result.error });
      } catch (error) {
        console.error('run_code error:', error);
        io.to(roomId).emit('code_output', {
          output: `Execution Error: ${error.message}`,
          error: true,
          executionTime: 0,
        });
      }
    });

    socket.on('timer_update', async ({ seconds, roomId, running }) => {
      socket.to(roomId).emit('timer_sync', { seconds, running });
      // Optionally log timer events if we want
    });

    socket.on('interview_end', async ({ roomId }) => {
      try {
        const room = await Room.findByIdAndUpdate(roomId, {
          status: 'completed',
          endedAt: new Date(),
        });
        
        io.to(roomId).emit('interview_end');
        
        const userData = socketToUser.get(socket.id);
        await logEvent(roomId, 'leave', userData?.user, { reason: 'interview_end' });
      } catch (error) {
        console.error('interview_end error:', error);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`Socket disconnected: ${socket.id}`);
      const userData = socketToUser.get(socket.id);
      
      if (userData) {
        const { roomId, user } = userData;
        socket.to(roomId).emit('participant_left', { id: socket.id });
        socketToUser.delete(socket.id);
        await logEvent(roomId, 'leave', user, { reason: 'disconnect' });
      }
    });
  });
};

module.exports = socketHandler;
