import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, AlertCircle, Save, FileText } from 'lucide-react';
import Button from './ui/Button';

const DIFFICULTY_OPTIONS = [
  { value: 'Easy', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', activeBg: 'bg-emerald-600 text-white' },
  { value: 'Medium', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', activeBg: 'bg-amber-600 text-white' },
  { value: 'Hard', color: 'bg-red-500/15 text-red-400 border-red-500/30', activeBg: 'bg-red-600 text-white' },
];

const emptyTestCase = () => ({ input: '', expectedOutput: '', isHidden: false });

export default function ProblemCreatorModal({ onClose, onSave, editingProblem = null, roomId }) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [testCases, setTestCases] = useState([emptyTestCase()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingProblem) {
      setTitle(editingProblem.title || '');
      setDifficulty(editingProblem.difficulty || 'Medium');
      setDescription(editingProblem.description || '');
      setConstraints(editingProblem.constraints || '');
      setInputFormat(editingProblem.inputFormat || '');
      setOutputFormat(editingProblem.outputFormat || '');
      setSampleInput(editingProblem.sampleInput || '');
      setSampleOutput(editingProblem.sampleOutput || '');
      setTestCases(
        editingProblem.testCases?.length > 0
          ? editingProblem.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput, isHidden: tc.isHidden || false }))
          : [emptyTestCase()]
      );
    }
  }, [editingProblem]);

  const addTestCase = () => {
    setTestCases(prev => [...prev, emptyTestCase()]);
  };

  const removeTestCase = (index) => {
    if (testCases.length <= 1) return;
    setTestCases(prev => prev.filter((_, i) => i !== index));
  };

  const updateTestCase = (index, field, value) => {
    setTestCases(prev =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    );
  };

  const handleSave = async () => {
    if (!title.trim()) { setError('Problem title is required.'); return; }
    if (!description.trim()) { setError('Problem description is required.'); return; }
    
    const validTestCases = testCases.filter(tc => tc.input.trim() || tc.expectedOutput.trim());
    if (validTestCases.length === 0) { setError('At least one test case with input and expected output is required.'); return; }
    
    const hasInvalidTC = validTestCases.some(tc => !tc.input.trim() || !tc.expectedOutput.trim());
    if (hasInvalidTC) { setError('All test cases must have both input and expected output.'); return; }

    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');

      const body = {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        constraints: constraints.trim(),
        inputFormat: inputFormat.trim(),
        outputFormat: outputFormat.trim(),
        sampleInput: sampleInput.trim(),
        sampleOutput: sampleOutput.trim(),
        testCases: validTestCases,
        roomId,
      };

      const url = editingProblem
        ? `${API_URL}/problems/${editingProblem._id}`
        : `${API_URL}/problems`;

      const res = await fetch(url, {
        method: editingProblem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save problem');

      if (onSave) onSave(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/15 flex items-center justify-center">
              <FileText size={18} className="text-blue-400" />
            </div>
            <h2 className="text-gray-100 font-semibold text-base">
              {editingProblem ? 'Edit Problem' : 'Create Problem'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Problem Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Two Sum"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    difficulty === opt.value ? opt.activeBg + ' border-transparent' : opt.color
                  }`}
                >
                  {opt.value}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-400">Problem Description *</label>
              <span className="text-[10px] text-gray-600">{description.length} chars</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
              placeholder="Describe the problem statement in detail..."
              rows={5}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all resize-y"
            />
          </div>

          {/* Constraints + I/O Format — 2 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Constraints</label>
              <textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. 1 <= N <= 10^5"
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Input Format</label>
              <textarea
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                placeholder="Describe the input structure..."
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Output Format</label>
              <textarea
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                placeholder="Describe the expected output..."
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all resize-y"
              />
            </div>
          </div>

          {/* Sample I/O */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Sample Input</label>
              <textarea
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                placeholder="5&#10;1 2 3 4 5"
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Sample Output</label>
              <textarea
                value={sampleOutput}
                onChange={(e) => setSampleOutput(e.target.value)}
                placeholder="15"
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all resize-y"
              />
            </div>
          </div>

          {/* Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-gray-400">Test Cases *</label>
              <Button variant="ghost" size="sm" icon={Plus} onClick={addTestCase}>
                Add Test Case
              </Button>
            </div>

            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-300">Test Case {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      {/* Hidden toggle */}
                      <button
                        onClick={() => updateTestCase(idx, 'isHidden', !tc.isHidden)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors ${
                          tc.isHidden
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-gray-700 text-gray-400 border border-gray-600'
                        }`}
                        title={tc.isHidden ? 'Hidden from candidate' : 'Visible to candidate'}
                      >
                        {tc.isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
                        {tc.isHidden ? 'Hidden' : 'Visible'}
                      </button>
                      {/* Delete */}
                      {testCases.length > 1 && (
                        <button
                          onClick={() => removeTestCase(idx)}
                          className="p-1 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                        placeholder="Test input..."
                        rows={2}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 text-xs font-mono focus:outline-none focus:border-blue-500 transition-all resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Expected Output</label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(idx, 'expectedOutput', e.target.value)}
                        placeholder="Expected output..."
                        rows={2}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 text-xs font-mono focus:outline-none focus:border-blue-500 transition-all resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-800 flex-shrink-0">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Save} className="flex-1" loading={loading} onClick={handleSave}>
            {loading ? 'Saving…' : editingProblem ? 'Update Problem' : 'Save Problem'}
          </Button>
        </div>
      </div>
    </div>
  );
}
