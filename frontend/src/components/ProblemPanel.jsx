import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, Copy, Check, Plus, Edit3, BookOpen } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import { copyToClipboard } from '../utils/helpers';
import ProblemCreatorModal from './ProblemCreatorModal';
import Badge from './ui/Badge';
import Button from './ui/Button';

const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Hard: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function CodeBlock({ label, content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(content);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  if (!content) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{label}</span>
        <button onClick={handleCopy} className="p-1 rounded text-gray-600 hover:text-blue-400 transition-colors">
          {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
        </button>
      </div>
      <pre className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-x-auto">
        {content}
      </pre>
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!children) return null;

  return (
    <div className="border-t border-gray-800/50 pt-2 mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs text-gray-400 hover:text-gray-200 transition-colors"
      >
        <span className="font-medium">{title}</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && <div className="mt-2 text-xs text-gray-300 leading-relaxed">{children}</div>}
    </div>
  );
}

export default function ProblemPanel() {
  const { role, currentProblem, setCurrentProblem, roomId } = useInterview();
  const [showCreator, setShowCreator] = useState(false);
  const [loading, setLoading] = useState(true);

  const isHR = role === ROLES.HR;

  // Fetch problem for this room on mount
  useEffect(() => {
    const fetchProblem = async () => {
      if (!roomId) { setLoading(false); return; }
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/problems/room/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setCurrentProblem(data[0]);
        }
      } catch {
        // Silently fail — problem may not exist yet
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [roomId]);

  const handleSaveProblem = (problem) => {
    setCurrentProblem(problem);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-800 rounded w-2/3" />
          <div className="h-3 bg-gray-800 rounded w-full" />
          <div className="h-3 bg-gray-800 rounded w-4/5" />
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <>
        {showCreator && (
          <ProblemCreatorModal
            onClose={() => setShowCreator(false)}
            onSave={handleSaveProblem}
            roomId={roomId}
          />
        )}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen size={12} className="text-blue-400" />
            Problem
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-2">
              <FileText size={18} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">
              {isHR ? 'No problem added yet' : 'Your interviewer will share a problem soon...'}
            </p>
            {isHR && (
              <Button variant="primary" size="sm" icon={Plus} className="mt-3" onClick={() => setShowCreator(true)}>
                Add Problem
              </Button>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {showCreator && (
        <ProblemCreatorModal
          onClose={() => setShowCreator(false)}
          onSave={handleSaveProblem}
          editingProblem={currentProblem}
          roomId={roomId}
        />
      )}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen size={12} className="text-blue-400" />
            Problem
          </div>
          {isHR && (
            <button
              onClick={() => setShowCreator(true)}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-blue-400 transition-colors"
            >
              <Edit3 size={10} /> Edit
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
          {/* Title + Difficulty */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-gray-100 font-semibold text-sm leading-tight">{currentProblem.title}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${DIFFICULTY_COLORS[currentProblem.difficulty] || DIFFICULTY_COLORS.Medium}`}>
              {currentProblem.difficulty}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">{currentProblem.description}</p>

          {/* Constraints */}
          <CollapsibleSection title="Constraints">
            <p className="font-mono text-gray-400">{currentProblem.constraints}</p>
          </CollapsibleSection>

          {/* Input/Output Format */}
          {currentProblem.inputFormat && (
            <CollapsibleSection title="Input Format">
              <p>{currentProblem.inputFormat}</p>
            </CollapsibleSection>
          )}
          {currentProblem.outputFormat && (
            <CollapsibleSection title="Output Format">
              <p>{currentProblem.outputFormat}</p>
            </CollapsibleSection>
          )}

          {/* Sample I/O */}
          <CodeBlock label="Sample Input" content={currentProblem.sampleInput} />
          <CodeBlock label="Sample Output" content={currentProblem.sampleOutput} />

          {/* Test case count info */}
          {currentProblem.testCases?.length > 0 && (
            <div className="pt-2 border-t border-gray-800/50">
              <span className="text-[10px] text-gray-500">
                {currentProblem.testCases.length} test case{currentProblem.testCases.length !== 1 ? 's' : ''} available
                {currentProblem.testCases.filter(tc => tc.isHidden).length > 0 && (
                  <> · {currentProblem.testCases.filter(tc => tc.isHidden).length} hidden</>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
