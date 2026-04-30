import React, { useState } from 'react';
import { Play, Send, ChevronDown, AlertTriangle, CheckCircle2, X, FlaskConical } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import Button from './ui/Button';

function SubmitConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-gray-100 font-semibold text-base">Submit Solution?</h3>
            <p className="text-gray-400 text-sm mt-1">
              This will submit your current code to the interviewer. You can still make changes after
              submitting.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="success" icon={Send} className="flex-1" onClick={onConfirm}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ControlBar() {
  const { language, isRunning, isRunningTests, isSubmitting, runCode, runTests, submitCode, currentProblem } = useInterview();
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const handleSubmit = async () => {
    setShowConfirm(false);
    await submitCode();
    setSubmitDone(true);
    setTimeout(() => setSubmitDone(false), 4000);
  };

  const hasTestCases = currentProblem?.testCases?.length > 0;

  return (
    <>
      {showConfirm && (
        <SubmitConfirmModal
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="h-14 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800 flex items-center justify-between px-4 gap-4 flex-shrink-0">
        {/* Left: Language badge */}
        <div className="flex items-center gap-2 hidden sm:flex">
          <span className="text-base">{language.icon}</span>
          <span className="text-gray-400 text-sm font-medium">{language.label}</span>
        </div>

        {/* Center: Actions */}
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          {/* Run */}
          {!hasTestCases && (
            <Button
              variant="secondary"
              icon={Play}
              size="md"
              loading={isRunning}
              onClick={runCode}
              id="run-code-btn"
              className="min-w-28"
            >
              {isRunning ? 'Running…' : 'Run Code'}
            </Button>
          )}

          {/* Run Tests — only if problem has test cases */}
          {hasTestCases && (
            <Button
              variant="secondary"
              icon={FlaskConical}
              size="md"
              loading={isRunningTests}
              onClick={runTests}
              id="run-tests-btn"
              className="min-w-28"
            >
              {isRunningTests ? 'Running Tests…' : 'Run Tests'}
            </Button>
          )}

          {/* Submit */}
          {submitDone ? (
            <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <CheckCircle2 size={15} />
              Submitted!
            </div>
          ) : (
            <Button
              variant="primary"
              icon={Send}
              size="md"
              loading={isSubmitting}
              onClick={() => setShowConfirm(true)}
              id="submit-code-btn"
              className="min-w-28"
            >
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
          )}
        </div>

        {/* Right: Status */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
          <div className={`w-1.5 h-1.5 rounded-full ${isRunning || isRunningTests ? 'bg-blue-500 animate-pulse' : 'bg-gray-700'}`} />
          {isRunning ? (
            <span className="text-blue-400">Executing…</span>
          ) : isRunningTests ? (
            <span className="text-blue-400">Testing…</span>
          ) : (
            <span>Ready</span>
          )}
        </div>
      </div>
    </>
  );
}
