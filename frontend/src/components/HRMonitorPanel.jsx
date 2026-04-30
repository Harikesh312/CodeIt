import React, { useState, useEffect, useRef } from 'react';
import {
  Monitor, User, Wifi, WifiOff, Clock3, CheckCircle2, XCircle,
  Terminal, FlaskConical, Code2, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import Badge from './ui/Badge';

function StatusDot({ online }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {online && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${online ? 'bg-emerald-500' : 'bg-gray-600'}`} />
    </span>
  );
}

function TestResultMiniCard({ result }) {
  return (
    <div className={`flex items-center justify-between px-2 py-1 rounded text-xs ${
      result.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
    }`}>
      <span>Test {result.testCaseNumber}</span>
      <div className="flex items-center gap-1">
        {result.passed ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
        <span>{result.executionTime}ms</span>
      </div>
    </div>
  );
}

export default function HRMonitorPanel() {
  const {
    participants, isCandidateOnline, lastRunResult, lastTestResults,
    lastSubmission, isSocketConnected
  } = useInterview();

  const [showFullCode, setShowFullCode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);

  // Track candidate typing via code_change events
  useEffect(() => {
    // We detect typing from lastRunResult updates; for a more accurate approach,
    // we'd listen to code_change directly, but this provides a simpler approximation.
    // The code_change events are handled in context and show activity
  }, []);

  const candidate = participants.find(p => p.role === ROLES.CANDIDATE);
  const candidateJoinedAt = candidate?.joinedAt;

  const formatTimeSince = (isoString) => {
    if (!isoString) return '—';
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const formatTs = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full space-y-3 overflow-y-auto">
      {/* Panel Header */}
      <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
        <Monitor size={13} className="text-blue-400" />
        HR Monitor
      </div>

      {/* Candidate Status */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">
          <User size={11} /> Candidate Status
        </div>

        {!candidate ? (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="relative mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                <User size={18} className="text-gray-600" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
              </span>
            </div>
            <p className="text-gray-400 text-sm">Waiting for candidate to join...</p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                {candidate.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5">
                <StatusDot online={candidate.online !== false} />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm font-medium truncate">{candidate.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={candidate.online !== false ? 'online' : 'offline'} dot>
                  {candidate.online !== false ? 'Online' : 'Offline'}
                </Badge>
                {candidateJoinedAt && (
                  <span className="text-[10px] text-gray-600">Joined {formatTimeSince(candidateJoinedAt)}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Last Run Results */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">
          <Terminal size={11} /> Last Code Run
        </div>

        {!lastRunResult ? (
          <p className="text-gray-600 text-xs">No code runs yet</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{formatTs(lastRunResult.timestamp)}</span>
              <div className="flex items-center gap-1">
                {lastRunResult.error ? (
                  <span className="flex items-center gap-1 text-red-400"><XCircle size={10} /> Error</span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={10} /> Success</span>
                )}
              </div>
            </div>
            {lastRunResult.language && (
              <span className="text-[10px] text-gray-600">Language: {lastRunResult.language}</span>
            )}
            {lastRunResult.output && (
              <pre className="bg-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 whitespace-pre-wrap max-h-24 overflow-y-auto">
                {lastRunResult.output.split('\n').slice(0, 5).join('\n')}
                {lastRunResult.output.split('\n').length > 5 && '\n...'}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Last Test Results */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">
          <FlaskConical size={11} /> Last Test Run
        </div>

        {!lastTestResults || !lastTestResults.summary ? (
          <p className="text-gray-600 text-xs">No test runs yet</p>
        ) : (
          <div className="space-y-2">
            {lastTestResults.timestamp && (
              <span className="text-[10px] text-gray-600">{formatTs(lastTestResults.timestamp)}</span>
            )}
            <div className={`flex items-center gap-2 text-sm font-semibold ${
              lastTestResults.summary.passed === lastTestResults.summary.total ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {lastTestResults.summary.passed} / {lastTestResults.summary.total} Passed
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  lastTestResults.summary.passed === lastTestResults.summary.total ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                style={{ width: `${(lastTestResults.summary.passed / lastTestResults.summary.total) * 100}%` }}
              />
            </div>
            <div className="space-y-1">
              {lastTestResults.results?.map((r) => (
                <TestResultMiniCard key={r.testCaseNumber} result={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Last Submission */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">
          <Code2 size={11} /> Last Submission
        </div>

        {!lastSubmission ? (
          <p className="text-gray-600 text-xs">No submissions yet</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{formatTs(lastSubmission.timestamp)}</span>
              <span className="text-gray-600">{lastSubmission.language}</span>
            </div>
            {lastSubmission.submittedBy && (
              <span className="text-[10px] text-gray-500">by {lastSubmission.submittedBy}</span>
            )}
            <pre className={`bg-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-y-auto transition-all ${
              showFullCode ? 'max-h-96' : 'max-h-24'
            }`}>
              {lastSubmission.code}
            </pre>
            {lastSubmission.code && lastSubmission.code.split('\n').length > 6 && (
              <button
                onClick={() => setShowFullCode(!showFullCode)}
                className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Eye size={10} />
                {showFullCode ? 'Show Less' : 'View Full Code'}
                {showFullCode ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
