import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Hash, ArrowRight, AlertCircle, Code2, Users } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function JoinRoomPage() {
  const { joinRoom, user, reset } = useInterview();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [roomCode, setRoomCode] = useState(searchParams.get('code') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const code = roomCode.trim().toUpperCase();
    if (!code) { setError('Please enter a room code.'); return; }
    if (code.length !== 6) { setError('Room code must be 6 characters.'); return; }
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/rooms/code/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Room not found');

      joinRoom(data._id, data.code, data.title, data.createdBy);
      navigate(`/room/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setRoomCode(val);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="w-full max-w-sm z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-2xl shadow-blue-500/30 mb-4">
            <Code2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Join Interview</h1>
          <p className="text-gray-400 mt-1.5 text-sm text-center">
            Enter the 6-digit code shared by your interviewer
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
          {/* Room code input */}
          <div className="mb-6">
            <label htmlFor="room-code-input" className="block text-xs font-medium text-gray-400 mb-3">
              Room Code
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                <Hash size={16} />
              </div>
              <input
                id="room-code-input"
                type="text"
                value={roomCode}
                onChange={handleCodeInput}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                placeholder="ABC123"
                maxLength={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-4 text-gray-100 placeholder-gray-600 text-2xl font-mono font-bold tracking-[0.3em] text-center focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all uppercase"
                style={{ letterSpacing: '0.3em' }}
              />
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                    i < roomCode.length ? 'bg-blue-500' : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* User info display */}
          {user && (
            <div className="flex items-center gap-2 mb-5 text-sm text-gray-500 bg-gray-800/50 border border-gray-800 rounded-xl px-4 py-2.5">
              <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </div>
              Joining as <span className="text-gray-300 font-medium">{user.name}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Join button */}
          <Button
            id="join-room-btn"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            iconRight={ArrowRight}
            onClick={handleJoin}
          >
            {loading ? 'Joining room…' : 'Join Room'}
          </Button>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs">
            Don&apos;t have a code?{' '}
            <button
              onClick={() => {
                reset();
                navigate('/');
              }}
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
