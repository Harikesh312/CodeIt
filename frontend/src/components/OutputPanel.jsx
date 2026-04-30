import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Trash2, Clock3, CheckCircle2, XCircle, ChevronDown, ChevronRight, FlaskConical, EyeOff } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';

function OutputLine({ line }) {
  if (line.startsWith('✓') || line.startsWith('// Stub') || line.includes('successfully')) {
    return <span className="text-emerald-400">{line}</span>;
  }
  if (line.toLowerCase().includes('error') || line.toLowerCase().includes('exception')) {
    return <span className="text-red-400">{line}</span>;
  }
  if (line.startsWith('//')) {
    return <span className="text-gray-500 italic">{line}</span>;
  }
  return <span className="text-gray-300">{line}</span>;
}

function TestCaseCard({ result }) {
  const [expanded, setExpanded] = useState(false);
  const passed = result.passed;

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-800/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown size={12} className="text-gray-500" /> : <ChevronRight size={12} className="text-gray-500" />}
          <span className="text-xs text-gray-300 font-medium">Test Case {result.testCaseNumber}</span>
          {passed ? (
            <span className="flex items-center gap-1 text-emerald-400 text-xs">
              <CheckCircle2 size={12} /> Passed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-400 text-xs">
              <XCircle size={12} /> Failed
            </span>
          )}
        </div>
        <span className="text-[10px] text-gray-500">{result.executionTime}ms</span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-800">
          {result.isHidden ? (
            <div className="flex items-center gap-2 py-3 text-xs text-gray-500">
              <EyeOff size={12} />
              This is a hidden test case — input and output are not shown
            </div>
          ) : (
            <>
              {result.input !== undefined && (
                <div className="mt-2">
                  <span className="text-[10px] text-gray-500 font-medium">Input</span>
                  <pre className="bg-gray-900 rounded px-2 py-1.5 text-xs font-mono text-gray-300 mt-0.5 whitespace-pre-wrap">{result.input}</pre>
                </div>
              )}
              {result.expectedOutput !== undefined && (
                <div>
                  <span className="text-[10px] text-gray-500 font-medium">Expected Output</span>
                  <pre className="bg-gray-900 rounded px-2 py-1.5 text-xs font-mono text-emerald-400 mt-0.5 whitespace-pre-wrap">{result.expectedOutput}</pre>
                </div>
              )}
              {result.actualOutput !== undefined && (
                <div>
                  <span className="text-[10px] text-gray-500 font-medium">Your Output</span>
                  <pre className={`bg-gray-900 rounded px-2 py-1.5 text-xs font-mono mt-0.5 whitespace-pre-wrap ${
                    passed ? 'text-emerald-400' : 'text-red-400'
                  }`}>{result.actualOutput}</pre>
                </div>
              )}
              {result.errorMessage && (
                <div>
                  <span className="text-[10px] text-red-400 font-medium">Error</span>
                  <pre className="bg-red-500/10 border border-red-500/20 rounded px-2 py-1.5 text-xs font-mono text-red-300 mt-0.5 whitespace-pre-wrap">{result.errorMessage}</pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TestResultsView({ testResults }) {
  if (!testResults || !testResults.summary) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-12">
        <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-3">
          <FlaskConical size={22} className="text-gray-600" />
        </div>
        <p className="text-gray-500 text-sm">No test results yet</p>
        <p className="text-gray-600 text-xs mt-1">Click "Run Tests" to test your code</p>
      </div>
    );
  }

  const { summary, results } = testResults;
  const allPassed = summary.passed === summary.total;
  const passPercentage = summary.total > 0 ? (summary.passed / summary.total) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className={`p-3 rounded-lg border ${allPassed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-semibold ${allPassed ? 'text-emerald-400' : 'text-red-400'}`}>
            {summary.passed} / {summary.total} Test Cases Passed
          </span>
          <span className="text-[10px] text-gray-500">{summary.totalExecutionTime}ms total</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${allPassed ? 'bg-emerald-500' : 'bg-red-500'}`}
            style={{ width: `${passPercentage}%` }}
          />
        </div>
      </div>

      {/* Individual results */}
      <div className="space-y-2">
        {results?.map((result) => (
          <TestCaseCard key={result.testCaseNumber} result={result} />
        ))}
      </div>
    </div>
  );
}

export default function OutputPanel() {
  const { output, isRunning, isRunningTests, submitResult, testResults } = useInterview();
  const bottomRef = useRef(null);
  const [history, setHistory] = React.useState([]);
  const [activeTab, setActiveTab] = useState('console');

  // Accumulate output history
  useEffect(() => {
    if (output) {
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...output,
          timestamp: output.timestamp || new Date().toISOString(),
        },
      ]);
    }
  }, [output]);

  // Auto-switch to test results tab when test results arrive
  useEffect(() => {
    if (testResults && testResults.summary) {
      setActiveTab('tests');
    }
  }, [testResults]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isRunning]);

  const formatTs = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header with tabs */}
      <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'console'
                ? 'text-emerald-400 border-emerald-400'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <Terminal size={13} />
            Console
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'tests'
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <FlaskConical size={13} />
            Test Results
            {testResults?.summary && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                testResults.summary.passed === testResults.summary.total
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {testResults.summary.passed}/{testResults.summary.total}
              </span>
            )}
          </button>
        </div>
        {activeTab === 'console' && history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors mr-3"
          >
            <Trash2 size={11} />
            Clear
          </button>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-4">
        {activeTab === 'console' ? (
          <>
            {history.length === 0 && !isRunning ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-3">
                  <Terminal size={22} className="text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">No output yet</p>
                <p className="text-gray-600 text-xs mt-1">Run your code to see results here</p>
              </div>
            ) : (
              <>
                {history.map((entry) => (
                  <div key={entry.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600 pb-1 border-b border-gray-800/50">
                      <Clock3 size={10} />
                      <span>{formatTs(entry.timestamp)}</span>
                      <span>·</span>
                      <span>{entry.executionTime}ms</span>
                      {entry.error ? (
                        <span className="flex items-center gap-1 text-red-500 ml-auto">
                          <XCircle size={10} /> Error
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-500 ml-auto">
                          <CheckCircle2 size={10} /> Success
                        </span>
                      )}
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {(entry.output || '').split('\n').map((line, i) => (
                        <div key={i}>
                          <OutputLine line={line} />
                        </div>
                      ))}
                    </pre>
                  </div>
                ))}

                {isRunning && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    Executing…
                  </div>
                )}
              </>
            )}

            {submitResult && (
              <div
                className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${
                  submitResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                {submitResult.success ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                <span>{submitResult.message}</span>
              </div>
            )}

            <div ref={bottomRef} />
          </>
        ) : (
          <>
            {isRunningTests ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex gap-0.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-gray-400 text-sm">Running Tests…</p>
              </div>
            ) : (
              <TestResultsView testResults={testResults} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
