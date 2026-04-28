// ─────────────────────────────────────────────────────────────────────────────
// socketService.js – Socket.IO stub
//
// HOW TO PLUG IN SOCKET.IO:
//   1. npm install socket.io-client
//   2. Replace the entire class body below with real socket.io-client calls.
//   3. Update SOCKET_URL to your backend URL (or use env variable).
//
// All event names are defined in utils/constants.js → SOCKET_EVENTS.
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

    // You might also want to pass token here depending on your auth setup
    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
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

  get isConnected() {
    return this._isConnected;
  }
}

const socketService = new SocketService();
export default socketService;
