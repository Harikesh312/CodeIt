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

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this._isConnected = false;
  }

  /**
   * Connect to the Socket.IO server.
   * TODO: Replace with → import { io } from 'socket.io-client';
   *                        this.socket = io(SOCKET_URL, { withCredentials: true });
   */
  connect(token) {
    console.log(`[SocketService] connect() called. URL: ${SOCKET_URL}, token: ${token}`);
    // Simulated connection
    this._isConnected = true;
    this._triggerListeners('connect', { id: 'stub-socket-id' });
    return this;
  }

  /**
   * Disconnect from the Socket.IO server.
   * TODO: Replace with → this.socket.disconnect();
   */
  disconnect() {
    console.log('[SocketService] disconnect() called.');
    this._isConnected = false;
    this._triggerListeners('disconnect', {});
  }

  /**
   * Emit an event to the server.
   * TODO: Replace with → this.socket.emit(event, data);
   * @param {string} event
   * @param {any} data
   */
  emit(event, data) {
    console.log(`[SocketService] emit → ${event}`, data);
    // Stub: echo back certain events for local development
    if (event === 'run_code') {
      setTimeout(() => {
        this._triggerListeners('code_output', {
          output: '// Stub output: Socket.IO not connected.\n// Connect backend to see real output.',
          error: false,
        });
      }, 800);
    }
  }

  /**
   * Register a listener for a socket event.
   * TODO: Replace with → this.socket.on(event, callback);
   * @param {string} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  /**
   * Remove a listener for a socket event.
   * TODO: Replace with → this.socket.off(event, callback);
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }

  // Internal: trigger registered listeners
  _triggerListeners(event, data) {
    (this.listeners[event] || []).forEach((cb) => cb(data));
  }

  get isConnected() {
    return this._isConnected;
  }
}

// Singleton instance — import this across the app
const socketService = new SocketService();
export default socketService;
