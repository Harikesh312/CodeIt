import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { ChevronDown, Copy, Check, Maximize2 } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { LANGUAGES } from '../utils/constants';
import { copyToClipboard } from '../utils/helpers';
import LoadingSpinner from './ui/LoadingSpinner';

export default function EditorPanel() {
  const { code, language, setCode, setLanguage } = useInterview();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cursorInfo, setCursorInfo] = useState({ line: 1, col: 1 });

  const handleEditorChange = useCallback(
    (value) => {
      setCode(value || '');
    },
    [setCode]
  );

  const handleEditorMount = (editor) => {
    editor.onDidChangeCursorPosition((e) => {
      setCursorInfo({
        line: e.position.lineNumber,
        col: e.position.column,
      });
    });
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* macOS-style dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>

          {/* Language selector */}
          <div className="relative">
            <button
              id="language-selector"
              onClick={() => setLangDropdownOpen((v) => !v)}
              className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md border border-gray-700 transition-colors"
            >
              <span>{language.icon}</span>
              <span>{language.label}</span>
              <ChevronDown
                size={13}
                className={`text-gray-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {langDropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute top-full mt-1 left-0 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-20 min-w-36 overflow-hidden">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleSelectLanguage(lang)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-800 ${
                        lang.id === language.id
                          ? 'text-blue-400 bg-blue-500/10'
                          : 'text-gray-300'
                      }`}
                    >
                      <span>{lang.icon}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Cursor position */}
          <span className="text-gray-600 text-xs font-mono hidden sm:block">
            Ln {cursorInfo.line}, Col {cursorInfo.col}
          </span>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          <button
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            title="Fullscreen (Coming soon)"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language.monacoId}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            wordWrap: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            automaticLayout: true,
          }}
          loading={
            <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
              <LoadingSpinner size="md" text="Loading editor..." />
            </div>
          }
        />
      </div>
    </div>
  );
}
