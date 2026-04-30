const Room = require('../models/Room');
const Session = require('../models/Session');
const Problem = require('../models/Problem');
const { runCode, runCodeWithTestCases } = require('../utils/codeRunner');

const socketHandler = (io) => {
  // socket.id -> { roomId, user: { name, role } }
  const socketToUser = new Map();

  // roomId -> Array of { socketId, name, role, joinedAt, online }
  const roomParticipants = new Map();

  // Helper to emit participants_update to a room
  const emitParticipantsUpdate = (roomId) => {
    const participants = roomParticipants.get(roomId) || [];
    io.to(roomId).emit('participants_update', { participants });
  };

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

      // Update roomParticipants map
      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, []);
      }
      const participants = roomParticipants.get(roomId);
      
      // Check if participant already exists (reconnection case)
      const existingIdx = participants.findIndex(
        (p) => p.name === user.name && p.role === user.role
      );
      if (existingIdx !== -1) {
        // Update existing entry — mark as online with new socketId
        participants[existingIdx].socketId = socket.id;
        participants[existingIdx].online = true;
      } else {
        // New participant
        participants.push({
          socketId: socket.id,
          name: user.name,
          role: user.role,
          joinedAt: new Date().toISOString(),
          online: true,
        });
      }

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
          joinedAt: new Date().toISOString(),
        });

        // Emit full participants list to everyone
        emitParticipantsUpdate(roomId);

        await logEvent(roomId, 'join', user);
      } catch (error) {
        console.error('join_room error:', error);
      }
    });

    socket.on('leave_room', async ({ roomId }) => {
      socket.leave(roomId);
      const userData = socketToUser.get(socket.id);
      socketToUser.delete(socket.id);

      // Mark participant as offline in roomParticipants
      if (roomParticipants.has(roomId)) {
        const participants = roomParticipants.get(roomId);
        const p = participants.find((p) => p.socketId === socket.id);
        if (p) p.online = false;
      }

      socket.to(roomId).emit('participant_left', { id: socket.id });
      emitParticipantsUpdate(roomId);

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

    socket.on('run_code', async ({ language, code, roomId, runType }) => {
      const userData = socketToUser.get(socket.id);
      try {
        const result = await runCode(language, code);
        
        // Emit to ENTIRE room including sender
        io.to(roomId).emit('code_output', {
          ...result,
          submittedBy: userData?.user?.name || 'Unknown',
          runType: runType || 'run',
          timestamp: new Date().toISOString(),
        });

        await logEvent(roomId, 'run', userData?.user, { language, error: result.error });
      } catch (error) {
        console.error('run_code error:', error);
        io.to(roomId).emit('code_output', {
          output: `Execution Error: ${error.message}`,
          error: true,
          executionTime: 0,
          submittedBy: userData?.user?.name || 'Unknown',
          runType: runType || 'run',
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on('run_tests', async ({ language, code, roomId, problemId }) => {
      const userData = socketToUser.get(socket.id);
      try {
        const problem = await Problem.findById(problemId);
        if (!problem) {
          io.to(roomId).emit('test_results_update', {
            error: true,
            errorMessage: 'Problem not found',
            submittedBy: userData?.user?.name || 'Unknown',
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const results = await runCodeWithTestCases(language, code, problem.testCases);
        
        io.to(roomId).emit('test_results_update', {
          ...results,
          submittedBy: userData?.user?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        });

        await logEvent(roomId, 'run', userData?.user, { language, type: 'test_run', passed: results.summary.passed, total: results.summary.total });
      } catch (error) {
        console.error('run_tests error:', error);
        io.to(roomId).emit('test_results_update', {
          error: true,
          errorMessage: error.message,
          submittedBy: userData?.user?.name || 'Unknown',
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on('code_submitted', ({ code, language, roomId, submittedBy }) => {
      io.to(roomId).emit('submission_received', {
        code,
        language,
        submittedBy,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('timer_update', async ({ seconds, roomId, running }) => {
      socket.to(roomId).emit('timer_sync', { seconds, running });
    });

    socket.on('interview_end', async ({ roomId }) => {
      try {
        const room = await Room.findByIdAndUpdate(roomId, {
          status: 'completed',
          endedAt: new Date(),
        });
        
        io.to(roomId).emit('interview_end');
        
        // Clean up room participants
        roomParticipants.delete(roomId);

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
        
        // Mark participant as offline (keep in array for history)
        if (roomParticipants.has(roomId)) {
          const participants = roomParticipants.get(roomId);
          const p = participants.find((p) => p.socketId === socket.id);
          if (p) p.online = false;
        }

        socket.to(roomId).emit('participant_left', { id: socket.id });
        emitParticipantsUpdate(roomId);
        
        socketToUser.delete(socket.id);
        await logEvent(roomId, 'leave', user, { reason: 'disconnect' });
      }
    });
  });
};

module.exports = socketHandler;
