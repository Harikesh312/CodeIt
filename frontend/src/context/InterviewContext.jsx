import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { DEFAULT_LANGUAGE, DEFAULT_CODE_TEMPLATES, ROLES, SOCKET_EVENTS } from '../utils/constants';
import { runCode as runCodeService, submitCode as submitCodeService } from '../services/codeRunnerService';
import socketService from '../services/socketService';

// ─────────────────────────────────────────────────────────────────────────────
// State shape
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  // Auth / Role
  user: null,          // { name, role }
  role: null,          // ROLES.HR | ROLES.CANDIDATE

  // Room
  roomId: null,
  roomCode: null,
  roomTitle: '',

  // Editor
  language: DEFAULT_LANGUAGE,
  code: DEFAULT_CODE_TEMPLATES[DEFAULT_LANGUAGE.id],

  // Execution
  output: null,        // { text, error, executionTime, timestamp }
  isRunning: false,
  isSubmitting: false,
  submitResult: null,

  // Timer
  timerSeconds: 0,
  timerRunning: false,

  // Participants
  participants: [],    // [{ id, name, role, online }]

  // Socket
  isSocketConnected: false,

  // UI
  sidebarOpen: true,
  error: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, role: action.payload.role };

    case 'SET_ROOM':
      return { ...state, roomId: action.payload.roomId, roomCode: action.payload.roomCode, roomTitle: action.payload.title || '' };

    case 'SET_LANGUAGE': {
      const lang = action.payload;
      return {
        ...state,
        language: lang,
        code: DEFAULT_CODE_TEMPLATES[lang.id] || state.code,
      };
    }

    case 'SET_CODE':
      return { ...state, code: action.payload };

    case 'RUN_START':
      return { ...state, isRunning: true, output: null, error: null };

    case 'RUN_SUCCESS':
      return { ...state, isRunning: false, output: action.payload };

    case 'RUN_ERROR':
      return { ...state, isRunning: false, error: action.payload };

    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, submitResult: null };

    case 'SUBMIT_DONE':
      return { ...state, isSubmitting: false, submitResult: action.payload };

    case 'SET_TIMER':
      return { ...state, timerSeconds: action.payload };

    case 'SET_TIMER_RUNNING':
      return { ...state, timerRunning: action.payload };

    case 'TICK_TIMER':
      return { ...state, timerSeconds: state.timerSeconds + 1 };

    case 'SET_PARTICIPANTS':
      return { ...state, participants: action.payload };

    case 'PARTICIPANT_JOINED':
      if (state.participants.find((p) => p.id === action.payload.id)) return state;
      return { ...state, participants: [...state.participants, action.payload] };

    case 'PARTICIPANT_LEFT':
      return {
        ...state,
        participants: state.participants.map((p) =>
          p.id === action.payload ? { ...p, online: false } : p
        ),
      };

    case 'SET_SOCKET_CONNECTED':
      return { ...state, isSocketConnected: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef(null);

  // ── Timer management ────────────────────────────────────────────────────────
  useEffect(() => {
    if (state.timerRunning) {
      timerRef.current = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state.timerRunning]);

  // ── Socket listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    const onConnect = () => dispatch({ type: 'SET_SOCKET_CONNECTED', payload: true });
    const onDisconnect = () => dispatch({ type: 'SET_SOCKET_CONNECTED', payload: false });

    const onCodeChange = ({ code }) => dispatch({ type: 'SET_CODE', payload: code });
    const onLanguageChange = ({ language }) => dispatch({ type: 'SET_LANGUAGE', payload: language });
    const onCodeOutput = (result) =>
      dispatch({ type: 'RUN_SUCCESS', payload: { ...result, timestamp: new Date().toISOString() } });
    const onParticipantJoined = (p) => dispatch({ type: 'PARTICIPANT_JOINED', payload: p });
    const onParticipantLeft = ({ id }) => dispatch({ type: 'PARTICIPANT_LEFT', payload: id });
    const onTimerSync = ({ seconds }) => dispatch({ type: 'SET_TIMER', payload: seconds });

    socketService.on(SOCKET_EVENTS.CONNECT, onConnect);
    socketService.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
    socketService.on(SOCKET_EVENTS.CODE_CHANGE, onCodeChange);
    socketService.on(SOCKET_EVENTS.LANGUAGE_CHANGE, onLanguageChange);
    socketService.on(SOCKET_EVENTS.CODE_OUTPUT, onCodeOutput);
    socketService.on(SOCKET_EVENTS.PARTICIPANT_JOINED, onParticipantJoined);
    socketService.on(SOCKET_EVENTS.PARTICIPANT_LEFT, onParticipantLeft);
    socketService.on(SOCKET_EVENTS.TIMER_SYNC, onTimerSync);

    return () => {
      socketService.off(SOCKET_EVENTS.CONNECT, onConnect);
      socketService.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
      socketService.off(SOCKET_EVENTS.CODE_CHANGE, onCodeChange);
      socketService.off(SOCKET_EVENTS.LANGUAGE_CHANGE, onLanguageChange);
      socketService.off(SOCKET_EVENTS.CODE_OUTPUT, onCodeOutput);
      socketService.off(SOCKET_EVENTS.PARTICIPANT_JOINED, onParticipantJoined);
      socketService.off(SOCKET_EVENTS.PARTICIPANT_LEFT, onParticipantLeft);
      socketService.off(SOCKET_EVENTS.TIMER_SYNC, onTimerSync);
    };
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const login = useCallback((name, role) => {
    dispatch({ type: 'SET_USER', payload: { name, role } });
  }, []);

  const joinRoom = useCallback((roomId, roomCode, title = '') => {
    dispatch({ type: 'SET_ROOM', payload: { roomId, roomCode, title } });
    socketService.connect();
    socketService.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, user: state.user });
  }, [state.user]);

  const setLanguage = useCallback((lang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    socketService.emit(SOCKET_EVENTS.LANGUAGE_CHANGE, { language: lang });
  }, []);

  const setCode = useCallback((code) => {
    dispatch({ type: 'SET_CODE', payload: code });
    // Throttle socket emit — in production use debounce/throttle
    socketService.emit(SOCKET_EVENTS.CODE_CHANGE, { code });
  }, []);

  const runCode = useCallback(async () => {
    dispatch({ type: 'RUN_START' });
    try {
      const result = await runCodeService(state.language.id, state.code);
      dispatch({
        type: 'RUN_SUCCESS',
        payload: { ...result, timestamp: new Date().toISOString() },
      });
    } catch (err) {
      dispatch({ type: 'RUN_ERROR', payload: err.message });
    }
  }, [state.language.id, state.code]);

  const submitCode = useCallback(async () => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      const result = await submitCodeService(state.language.id, state.code, state.roomId);
      dispatch({ type: 'SUBMIT_DONE', payload: result });
      socketService.emit(SOCKET_EVENTS.RUN_CODE, { language: state.language.id, code: state.code, roomId: state.roomId });
    } catch (err) {
      dispatch({ type: 'SUBMIT_DONE', payload: { success: false, message: err.message } });
    }
  }, [state.language.id, state.code, state.roomId]);

  const startTimer = useCallback(() => dispatch({ type: 'SET_TIMER_RUNNING', payload: true }), []);
  const pauseTimer = useCallback(() => dispatch({ type: 'SET_TIMER_RUNNING', payload: false }), []);
  const resetTimer = useCallback(() => {
    dispatch({ type: 'SET_TIMER_RUNNING', payload: false });
    dispatch({ type: 'SET_TIMER', payload: 0 });
  }, []);

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setError = useCallback((msg) => dispatch({ type: 'SET_ERROR', payload: msg }), []);
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const value = {
    ...state,
    login,
    joinRoom,
    setLanguage,
    setCode,
    runCode,
    submitCode,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleSidebar,
    setError,
    clearError,
    reset,
  };

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom hook
// ─────────────────────────────────────────────────────────────────────────────
export function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used inside <InterviewProvider>');
  return ctx;
}

export default InterviewContext;
