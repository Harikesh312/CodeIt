import React, { useState, useEffect } from 'react';
import { Video, AlertCircle } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import LoadingSpinner from './ui/LoadingSpinner';

export default function VideoPanel() {
  const { roomCode, setError } = useInterview();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/video/room`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ roomCode }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to initialize video');
        }
        
        setVideoUrl(data.url);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (roomCode) {
      fetchVideoUrl();
    }
  }, [roomCode, setError]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-[320px]">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider p-3 border-b border-gray-800 shrink-0">
        <Video size={12} className="text-blue-400" />
        Video Call
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden rounded-b-xl bg-black/50">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <LoadingSpinner text="Connecting camera..." />
          </div>
        ) : videoUrl ? (
          <iframe
            src={videoUrl}
            allow="camera; microphone; fullscreen; display-capture"
            className="w-full h-full border-0"
            title="Video Call"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <AlertCircle size={24} className="mb-2" />
            <p className="text-xs">Video unavailable</p>
          </div>
        )}
      </div>
    </div>
  );
}
