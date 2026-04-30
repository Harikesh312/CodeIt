import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_LANGUAGE, DEFAULT_CODE_TEMPLATES, ROLES, SOCKET_EVENTS, LANGUAGES } from '../utils/constants';
import { runCode as runCodeService, submitCode as submitCodeService, runTests as runTestsService } from '../services/codeRunnerService';
import socketService from '../services/socketService';

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  USER: 'codeit_user',
  ROOM: 'codeit_room',
  CODE: 'codeit_code',
  LANGUAGE: 'codeit_language',
};

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded or private mode */ }
}

function readFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// State shape
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  // Auth / Role
  user: null,          // { name, role, id, token }
  role: null,          // ROLES.HR | ROLES.CANDIDATE

  // Room
  roomId: null,
  roomCode: null,
  roomTitle: '',
  createdBy: '',

  // Editor
  language: DEFAULT_LANGUAGE,
  code: DEFAULT_CODE_TEMPLATES[DEFAULT_LANGUAGE.id],

  // Execution
  output: null,        // { text, error, executionTime, timestamp }
  isRunning: false,
  isSubmitting: false,
  submitResult: null,

  // Test Results
  testResults: null,
  isRunningTests: false,

  // Timer
  timerSeconds: 0,
  timerRunning: false,

  // Participants
  participants: [],    // [{ id, name, role, online, joinedAt }]

  // Socket
  isSocketConnected: false,

  // Problem
  currentProblem: null,

  // HR Monitor
  lastRunResult: null,
  lastTestResults: null,
  lastSubmission: null,

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
      return { ...state, user: action.payload, role: action.payload?.role || null };

    case 'SET_ROOM':
      return { ...state, roomId: action.payload.roomId, roomCode: action.payload.roomCode, roomTitle: action.payload.title || '', createdBy: action.payload.createdBy || '' };

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

    case 'RUN_TESTS_START':
      return { ...state, isRunningTests: true, testResults: null };

    case 'RUN_TESTS_SUCCESS':
      return { ...state, isRunningTests: false, testResults: action.payload };

    case 'RUN_TESTS_ERROR':
      return { ...state, isRunningTests: false, error: action.payload };

    case 'SET_TEST_RESULTS':
      return { ...state, testResults: action.payload };

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

    case 'SET_PROBLEM':
      return { ...state, currentProblem: action.payload };

    case 'SET_LAST_RUN_RESULT':
      return { ...state, lastRunResult: action.payload };

    case 'SET_LAST_TEST_RESULTS':
      return { ...state, lastTestResults: action.payload };

    case 'SET_LAST_SUBMISSION':
      return { ...state, lastSubmission: action.payload };

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
  const setCodeTimeoutRef = useRef(null);
  const restoredCodeRef = useRef(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // ── Restore session from localStorage on mount ───────────────────────────
  useEffect(() => {
    const savedUser = readFromStorage(STORAGE_KEYS.USER);
    const savedRoom = readFromStorage(STORAGE_KEYS.ROOM);
    const savedCode = readFromStorage(STORAGE_KEYS.CODE);
    const savedLangId = readFromStorage(STORAGE_KEYS.LANGUAGE);

    if (savedLangId) {
      const langObj = LANGUAGES.find((l) => l.id === savedLangId);
      if (langObj) dispatch({ type: 'SET_LANGUAGE', payload: langObj });
    }
    if (savedCode) {
      dispatch({ type: 'SET_CODE', payload: savedCode });
      restoredCodeRef.current = true;
    }

    if (savedUser && savedUser.token) {
      // Validate token is not obviously expired by checking its payload
      try {
        const payload = JSON.parse(atob(savedUser.token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          // Token expired — clear storage
          removeFromStorage(STORAGE_KEYS.USER);
          removeFromStorage(STORAGE_KEYS.ROOM);
          localStorage.removeItem('token');
          setIsRestoringSession(false);
          return;
        }
      } catch {
        // Malformed token — clear
        removeFromStorage(STORAGE_KEYS.USER);
        removeFromStorage(STORAGE_KEYS.ROOM);
        localStorage.removeItem('token');
        setIsRestoringSession(false);
        return;
      }

      dispatch({ type: 'SET_USER', payload: savedUser });
      localStorage.setItem('token', savedUser.token);

      if (savedRoom && savedRoom.roomId) {
        dispatch({ type: 'SET_ROOM', payload: savedRoom });
        socketService.connect();
        socketService.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId: savedRoom.roomId, user: savedUser });
      }
    }

    setIsRestoringSession(false);
  }, []);

  // ── Timer management ────────────────────────────────────────────────────────
  useEffect(() => {
    // Only HR ticks locally. Candidates rely purely on syncs to prevent double-ticking flutter.
    if (state.timerRunning && state.role === ROLES.HR) {
      timerRef.current = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state.timerRunning, state.role]);

  // Sync timer to candidates (HR is the source of truth)
  useEffect(() => {
    if (state.role === ROLES.HR && state.roomId) {
      socketService.emit('timer_update', {
        seconds: state.timerSeconds,
        roomId: state.roomId,
        running: state.timerRunning,
      });
    }
  }, [state.timerSeconds, state.timerRunning, state.role, state.roomId]);

  // ── Socket listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    const onConnect = () => dispatch({ type: 'SET_SOCKET_CONNECTED', payload: true });
    const onDisconnect = () => dispatch({ type: 'SET_SOCKET_CONNECTED', payload: false });

    const onCodeChange = ({ code }) => dispatch({ type: 'SET_CODE', payload: code });
    const onLanguageChange = ({ language }) => dispatch({ type: 'SET_LANGUAGE', payload: language });
    const onCodeOutput = (result) => {
      dispatch({ type: 'RUN_SUCCESS', payload: { ...result, timestamp: new Date().toISOString() } });
      dispatch({ type: 'SET_LAST_RUN_RESULT', payload: { ...result, timestamp: new Date().toISOString() } });
    };
    const onParticipantJoined = (p) => dispatch({ type: 'PARTICIPANT_JOINED', payload: p });
    const onParticipantLeft = ({ id }) => dispatch({ type: 'PARTICIPANT_LEFT', payload: id });
    const onParticipantsUpdate = ({ participants }) => dispatch({ type: 'SET_PARTICIPANTS', payload: participants });
    const onTimerSync = ({ seconds, running }) => {
      dispatch({ type: 'SET_TIMER', payload: seconds });
      if (running !== undefined) {
        dispatch({ type: 'SET_TIMER_RUNNING', payload: running });
      }
    };
    const onInterviewEnd = () => {
      removeFromStorage(STORAGE_KEYS.ROOM);
      socketService.disconnect();
      alert('The interview has been ended by the interviewer.');
      window.location.href = '/';
    };
    const onProblemUpdated = (problem) => {
      dispatch({ type: 'SET_PROBLEM', payload: problem });
    };
    const onTestResultsUpdate = (results) => {
      dispatch({ type: 'SET_TEST_RESULTS', payload: results });
      dispatch({ type: 'SET_LAST_TEST_RESULTS', payload: results });
    };
    const onSubmissionReceived = (data) => {
      dispatch({ type: 'SET_LAST_SUBMISSION', payload: data });
    };

    socketService.on(SOCKET_EVENTS.CONNECT, onConnect);
    socketService.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
    socketService.on(SOCKET_EVENTS.CODE_CHANGE, onCodeChange);
    socketService.on(SOCKET_EVENTS.LANGUAGE_CHANGE, onLanguageChange);
    socketService.on(SOCKET_EVENTS.CODE_OUTPUT, onCodeOutput);
    socketService.on(SOCKET_EVENTS.PARTICIPANT_JOINED, onParticipantJoined);
    socketService.on(SOCKET_EVENTS.PARTICIPANT_LEFT, onParticipantLeft);
    socketService.on('participants_update', onParticipantsUpdate);
    socketService.on(SOCKET_EVENTS.TIMER_SYNC, onTimerSync);
    socketService.on('interview_end', onInterviewEnd);
    socketService.on('problem_updated', onProblemUpdated);
    socketService.on('test_results_update', onTestResultsUpdate);
    socketService.on('submission_received', onSubmissionReceived);

    return () => {
      socketService.off(SOCKET_EVENTS.CONNECT, onConnect);
      socketService.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
      socketService.off(SOCKET_EVENTS.CODE_CHANGE, onCodeChange);
      socketService.off(SOCKET_EVENTS.LANGUAGE_CHANGE, onLanguageChange);
      socketService.off(SOCKET_EVENTS.CODE_OUTPUT, onCodeOutput);
      socketService.off(SOCKET_EVENTS.PARTICIPANT_JOINED, onParticipantJoined);
      socketService.off(SOCKET_EVENTS.PARTICIPANT_LEFT, onParticipantLeft);
      socketService.off('participants_update', onParticipantsUpdate);
      socketService.off(SOCKET_EVENTS.TIMER_SYNC, onTimerSync);
      socketService.off('interview_end', onInterviewEnd);
      socketService.off('problem_updated', onProblemUpdated);
      socketService.off('test_results_update', onTestResultsUpdate);
      socketService.off('submission_received', onSubmissionReceived);
    };
  }, []);

  const [lastProblemId, setLastProblemId] = useState(null);
  useEffect(() => {
    if (state.currentProblem && state.currentProblem._id !== lastProblemId) {
      const isInitialLoad = lastProblemId === null;
      setLastProblemId(state.currentProblem._id);
      
      if (state.role === ROLES.CANDIDATE && state.currentProblem.testCases?.length > 0) {
        if (isInitialLoad && restoredCodeRef.current) {
          // Do not overwrite saved code on refresh
        } else {
          // Auto-update to default reading template
          const codeToSet = DEFAULT_CODE_TEMPLATES[state.language.id];
          dispatch({ type: 'SET_CODE', payload: codeToSet });
          saveToStorage(STORAGE_KEYS.CODE, codeToSet);
          socketService.emit(SOCKET_EVENTS.CODE_CHANGE, { code: codeToSet });
        }
      }
    }
  }, [state.currentProblem, state.role, state.language.id, lastProblemId]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (name, role) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const userData = { ...data.user, token: data.token };

      // Save to localStorage FIRST, then dispatch
      localStorage.setItem('token', data.token);
      saveToStorage(STORAGE_KEYS.USER, userData);
      
      dispatch({ type: 'SET_USER', payload: userData });

      // Return a promise that resolves after state update propagates
      return new Promise((resolve) => {
        // Use setTimeout(0) to ensure dispatch has been processed
        setTimeout(resolve, 0);
      });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const joinRoom = useCallback((roomId, roomCode, title = '', createdBy = '') => {
    dispatch({ type: 'SET_ROOM', payload: { roomId, roomCode, title, createdBy } });

    // Persist room data to localStorage
    saveToStorage(STORAGE_KEYS.ROOM, { roomId, roomCode, title, createdBy });

    socketService.connect();
    socketService.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, user: state.user });
  }, [state.user]);

  const rejoinRoom = useCallback((roomId, roomCode, title, createdBy, user) => {
    dispatch({ type: 'SET_ROOM', payload: { roomId, roomCode, title, createdBy } });
    socketService.connect();
    socketService.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, user });
  }, []);

  const setLanguage = useCallback((lang) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    saveToStorage(STORAGE_KEYS.LANGUAGE, lang.id);
    socketService.emit(SOCKET_EVENTS.LANGUAGE_CHANGE, { language: lang });
  }, []);

  const setCode = useCallback((code) => {
    dispatch({ type: 'SET_CODE', payload: code });
    if (setCodeTimeoutRef.current) clearTimeout(setCodeTimeoutRef.current);
    setCodeTimeoutRef.current = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.CODE, code);
    }, 2000);
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

      // Also emit via socket so HR can see it
      if (state.roomId) {
        socketService.emit(SOCKET_EVENTS.RUN_CODE, {
          language: state.language.id,
          code: state.code,
          roomId: state.roomId,
          runType: 'run',
        });
      }
    } catch (err) {
      dispatch({ type: 'RUN_ERROR', payload: err.message });
    }
  }, [state.language.id, state.code, state.roomId]);

  const runTests = useCallback(async () => {
    if (!state.currentProblem?._id) return;
    dispatch({ type: 'RUN_TESTS_START' });
    try {
      const result = await runTestsService(state.language.id, state.code, state.roomId, state.currentProblem._id);
      dispatch({ type: 'RUN_TESTS_SUCCESS', payload: result });

      // Also emit via socket so HR can see test results
      if (state.roomId) {
        socketService.emit('run_tests', {
          language: state.language.id,
          code: state.code,
          roomId: state.roomId,
          problemId: state.currentProblem._id,
        });
      }
    } catch (err) {
      dispatch({ type: 'RUN_TESTS_ERROR', payload: err.message });
    }
  }, [state.language.id, state.code, state.roomId, state.currentProblem]);

  const submitCode = useCallback(async () => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      const result = await submitCodeService(state.language.id, state.code, state.roomId);
      dispatch({ type: 'SUBMIT_DONE', payload: result });

      // Emit submission event via socket
      socketService.emit('code_submitted', {
        code: state.code,
        language: state.language.id,
        roomId: state.roomId,
        submittedBy: state.user?.name,
      });
    } catch (err) {
      dispatch({ type: 'SUBMIT_DONE', payload: { success: false, message: err.message } });
    }
  }, [state.language.id, state.code, state.roomId, state.user]);

  const startTimer = useCallback(() => dispatch({ type: 'SET_TIMER_RUNNING', payload: true }), []);
  const pauseTimer = useCallback(() => dispatch({ type: 'SET_TIMER_RUNNING', payload: false }), []);
  const resetTimer = useCallback(() => {
    dispatch({ type: 'SET_TIMER_RUNNING', payload: false });
    dispatch({ type: 'SET_TIMER', payload: 0 });
  }, []);

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setError = useCallback((msg) => dispatch({ type: 'SET_ERROR', payload: msg }), []);
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  const reset = useCallback(() => {
    removeFromStorage(STORAGE_KEYS.USER);
    removeFromStorage(STORAGE_KEYS.ROOM);
    removeFromStorage(STORAGE_KEYS.CODE);
    removeFromStorage(STORAGE_KEYS.LANGUAGE);
    localStorage.removeItem('token');
    socketService.disconnect();
    dispatch({ type: 'RESET' });
  }, []);

  const endInterview = useCallback(() => {
    if (state.roomId) {
      socketService.emit('interview_end', { roomId: state.roomId });
    }
    removeFromStorage(STORAGE_KEYS.ROOM);
  }, [state.roomId]);

  const setCurrentProblem = useCallback((problem) => {
    dispatch({ type: 'SET_PROBLEM', payload: problem });
  }, []);

  // Derived state
  const isCandidateOnline = state.participants.some(
    (p) => p.role === ROLES.CANDIDATE && p.online !== false
  );
  const onlineCount = state.participants.filter((p) => p.online !== false).length;

  const value = {
    ...state,
    isRestoringSession,
    isCandidateOnline,
    onlineCount,
    login,
    joinRoom,
    rejoinRoom,
    setLanguage,
    setCode,
    runCode,
    runTests,
    submitCode,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleSidebar,
    setError,
    clearError,
    reset,
    endInterview,
    setCurrentProblem,
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
