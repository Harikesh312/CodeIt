import React, { useEffect, useRef } from 'react';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import { formatTime } from '../utils/helpers';

/**
 * Timer component.
 *
 * Props:
 *   compact – shows only the time display (for Navbar)
 */
export default function Timer({ compact = false }) {
  const { timerSeconds, timerRunning, startTimer, pauseTimer, resetTimer, role } = useInterview();

  const isLow = timerSeconds >= 55 * 60; // show red when ≥ 55 min elapsed
  const isHR = role === ROLES.HR;

  const timeColor = isLow
    ? 'text-red-400'
    : timerSeconds >= 45 * 60
    ? 'text-amber-400'
    : 'text-emerald-400';

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 font-mono text-sm font-semibold ${timeColor}`}>
        <Clock size={13} className={isLow && timerRunning ? 'animate-pulse' : ''} />
        {formatTime(timerSeconds)}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
          <Clock size={13} />
          Timer
        </div>
        {isLow && timerRunning && (
          <span className="text-red-400 text-xs animate-pulse font-semibold">
            ⚠ Time running out
          </span>
        )}
      </div>

      {/* Main display */}
      <div
        className={`text-center font-mono text-4xl font-bold tracking-widest mb-4 ${timeColor} transition-colors duration-1000`}
      >
        {formatTime(timerSeconds)}
      </div>

      {/* Controls — HR only */}
      {isHR && (
        <div className="flex items-center gap-2">
          <button
            onClick={timerRunning ? pauseTimer : startTimer}
            className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm transition-all"
          >
            {timerRunning ? <Pause size={14} /> : <Play size={14} />}
            {timerRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="py-1.5 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-all"
            title="Reset timer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
