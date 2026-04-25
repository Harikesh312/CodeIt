import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, Clock3, CheckCircle2, XCircle } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';

function OutputLine({ line }) {
  // Color-code lines by prefix
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

export default function OutputPanel() {
  const { output, isRunning, submitResult } = useInterview();
  const bottomRef = useRef(null);
  const [history, setHistory] = React.useState([]);

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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
          <Terminal size={14} className="text-emerald-400" />
          Output Console
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            <Trash2 size={11} />
            Clear
          </button>
        )}
      </div>

      {/* Console body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-4">
        {history.length === 0 && !isRunning ? (
          /* Empty state */
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
                {/* Run header */}
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
                {/* Output lines */}
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {entry.output.split('\n').map((line, i) => (
                    <div key={i}>
                      <OutputLine line={line} />
                    </div>
                  ))}
                </pre>
              </div>
            ))}

            {/* Running indicator */}
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

        {/* Submit result toast */}
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
      </div>
    </div>
  );
}
