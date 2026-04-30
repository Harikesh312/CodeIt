// ─────────────────────────────────────────────────────────────────────────────
// socketService.js – Socket.IO client service
// ─────────────────────────────────────────────────────────────────────────────

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this._isConnected = false;
  }

  connect() {
    if (this.socket) {
      return this;
    }

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log(`[SocketService] connected. ID: ${this.socket.id}`);
      this._isConnected = true;
      this._triggerListeners('connect', { id: this.socket.id });
    });

    this.socket.on('disconnect', () => {
      console.log('[SocketService] disconnected.');
      this._isConnected = false;
      this._triggerListeners('disconnect', {});
    });

    // On reconnect, automatically rejoin room using stored data
    this.socket.io.on('reconnect', (attemptNumber) => {
      console.log(`[SocketService] reconnected after ${attemptNumber} attempts`);
      this._isConnected = true;
      this._triggerListeners('connect', { id: this.socket.id });

      // Auto-rejoin room from localStorage
      try {
        const savedRoom = JSON.parse(localStorage.getItem('codeit_room') || 'null');
        const savedUser = JSON.parse(localStorage.getItem('codeit_user') || 'null');

        if (savedRoom && savedRoom.roomId && savedUser) {
          console.log(`[SocketService] Auto-rejoining room: ${savedRoom.roomId}`);
          this.socket.emit('join_room', {
            roomId: savedRoom.roomId,
            user: { name: savedUser.name, role: savedUser.role },
          });
        }
      } catch (err) {
        console.error('[SocketService] Failed to auto-rejoin room:', err);
      }
    });

    this.socket.io.on('reconnect_attempt', (attemptNumber) => {
      console.log(`[SocketService] reconnection attempt #${attemptNumber}`);
    });

    this.socket.io.on('reconnect_failed', () => {
      console.error('[SocketService] reconnection failed after all attempts');
    });

    // Re-register all existing listeners on this new socket
    this._reRegisterAllListeners();

    return this;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this._isConnected = false;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    if (this.socket) {
      // Unsubscribe first to prevent duplicate registrations if called multiple times
      this.socket.off(event);
      // Re-subscribe and trigger all registered callbacks for this event
      this.socket.on(event, (data) => {
        this.listeners[event].forEach((cb) => cb(data));
      });
    }
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    
    // If no more callbacks, remove the listener from socket completely
    if (this.listeners[event].length === 0 && this.socket) {
      this.socket.off(event);
    }
  }

  _triggerListeners(event, data) {
    (this.listeners[event] || []).forEach((cb) => cb(data));
  }

  _reRegisterAllListeners() {
    if (!this.socket) return;
    for (const event of Object.keys(this.listeners)) {
      if (event === 'connect' || event === 'disconnect') continue; // Already set up above
      if (this.listeners[event].length > 0) {
        this.socket.off(event);
        this.socket.on(event, (data) => {
          (this.listeners[event] || []).forEach((cb) => cb(data));
        });
      }
    }
  }

  get isConnected() {
    return this._isConnected;
  }
}

const socketService = new SocketService();
export default socketService;
