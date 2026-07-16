import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, AlertCircle, Save, FileText } from 'lucide-react';
import Button from './ui/Button';

const DIFFICULTY_OPTIONS = [
  { value: 'Easy', color: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30', activeBg: 'bg-[#10B981] text-white' },
  { value: 'Medium', color: 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30', activeBg: 'bg-[#F59E0B] text-white' },
  { value: 'Hard', color: 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30', activeBg: 'bg-[#EF4444] text-white' },
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
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-scale-in" style={{ backgroundColor: '#131C2F', border: '1px solid #283548', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom: '1px solid #283548' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(79,70,229,0.15)' }}>
              <FileText size={18} style={{ color: '#818CF8' }} />
            </div>
            <h2 className="font-semibold text-base" style={{ color: '#F8FAFC' }}>
              {editingProblem ? 'Edit Problem' : 'Create Problem'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all duration-200 cursor-pointer"
            style={{ color: '#64748B' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#F8FAFC'; e.currentTarget.style.backgroundColor = '#182235'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-7 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: '#94A3B8' }}>Problem Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Two Sum"
              className="w-full rounded-xl px-4 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]"
              style={{ backgroundColor: '#182235', border: '1px solid #283548', color: '#F8FAFC' }}
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: '#94A3B8' }}>Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer ${
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
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Problem Description *</label>
              <span className="text-[10px]" style={{ color: '#64748B' }}>{description.length} chars</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
              placeholder="Describe the problem statement in detail..."
              rows={5}
              className="w-full rounded-xl px-4 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-y"
              style={{ backgroundColor: '#182235', border: '1px solid #283548', color: '#F8FAFC' }}
            />
          </div>

          {/* Constraints + I/O Format — 2 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: '#94A3B8' }}>Constraints</label>
              <textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. 1 <= N <= 10^5"
                rows={2}
                className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-y"
                style={{ backgroundColor: '#182235', border: '1px solid #283548', color: '#F8FAFC' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: '#94A3B8' }}>Input Format</label>
              <textarea
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                placeholder="Describe the input structure..."
                rows={2}
                className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-y"
                style={{ backgroundColor: '#182235', border: '1px solid #283548', color: '#F8FAFC' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: '#94A3B8' }}>Output Format</label>
              <textarea
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                placeholder="Describe the expected output..."
                rows={2}
                className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-y"
                style={{ backgroundColor: '#182235', border: '1px solid #283548', color: '#F8FAFC' }}
              />
            </div>
          </div>

          {/* Sample I/O */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: '#94A3B8' }}>Sample Input</label>
              <textarea
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                placeholder="5&#10;1 2 3 4 5"
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-y"
                style={{ backgroundColor: '#182235', border: '1px solid #283548', color: '#F8FAFC' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2.5 uppercase tracking-wider" style={{ color: '#94A3B8' }}>Sample Output</label>
              <textarea
                value={sampleOutput}
                onChange={(e) => setSampleOutput(e.target.value)}
                placeholder="15"
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-y"
                style={{ backgroundColor: '#182235', border: '1px solid #283548', color: '#F8FAFC' }}
              />
            </div>
          </div>

          {/* Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Test Cases *</label>
              <Button variant="ghost" size="sm" icon={Plus} onClick={addTestCase}>
                Add Test Case
              </Button>
            </div>

            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <div key={idx} className="rounded-xl p-4 space-y-3" style={{ backgroundColor: '#182235', border: '1px solid #283548' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: '#F8FAFC' }}>Test Case {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      {/* Hidden toggle */}
                      <button
                        onClick={() => updateTestCase(idx, 'isHidden', !tc.isHidden)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                          tc.isHidden
                            ? 'bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30'
                            : 'border'
                        }`}
                        style={!tc.isHidden ? { backgroundColor: '#283548', color: '#94A3B8', borderColor: '#334155' } : {}}
                        title={tc.isHidden ? 'Hidden from candidate' : 'Visible to candidate'}
                      >
                        {tc.isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
                        {tc.isHidden ? 'Hidden' : 'Visible'}
                      </button>
                      {/* Delete */}
                      {testCases.length > 1 && (
                        <button
                          onClick={() => removeTestCase(idx)}
                          className="p-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                          style={{ color: '#64748B' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold mb-1" style={{ color: '#64748B' }}>Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                        placeholder="Test input..."
                        rows={2}
                        className="w-full rounded-lg px-3 py-2 text-xs font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-y"
                        style={{ backgroundColor: '#131C2F', border: '1px solid #283548', color: '#F8FAFC' }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold mb-1" style={{ color: '#64748B' }}>Expected Output</label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(idx, 'expectedOutput', e.target.value)}
                        placeholder="Expected output..."
                        rows={2}
                        className="w-full rounded-lg px-3 py-2 text-xs font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-y"
                        style={{ backgroundColor: '#131C2F', border: '1px solid #283548', color: '#F8FAFC' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 flex-shrink-0" style={{ borderTop: '1px solid #283548' }}>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Save} className="flex-1" loading={loading} onClick={handleSave}>
            {loading ? 'Saving…' : editingProblem ? 'Update Problem' : 'Save Problem'}
          </Button>
        </div>
      </div>
    </div>
  );
}
