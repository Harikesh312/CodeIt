import React, { useState, useEffect } from 'react';
import { Video, AlertCircle, VideoOff } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import socketService from '../services/socketService';
import LoadingSpinner from './ui/LoadingSpinner';

export default function VideoPanel() {
  const { roomCode } = useInterview();
  const [isInterviewActive, setIsInterviewActive] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Construct Jitsi URL directly — no backend API call needed
  const videoUrl = roomCode
    ? `https://meet.jit.si/CodeIt-Interview-${roomCode}`
    : null;

  // Listen for interview_end to stop the video
  useEffect(() => {
    const onInterviewEnd = () => {
      setIsInterviewActive(false);
    };

    socketService.on('interview_end', onInterviewEnd);
    return () => {
      socketService.off('interview_end', onInterviewEnd);
    };
  }, []);

  // Simulate brief loading to allow iframe to start
  useEffect(() => {
    if (videoUrl) {
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [videoUrl]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-[320px]">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider p-3 border-b border-gray-800 shrink-0">
        <Video size={12} className="text-blue-400" />
        Video Call
        {isInterviewActive && (
          <span className="ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-normal normal-case">Live</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden rounded-b-xl bg-black/50">
        {!isInterviewActive ? (
          /* Interview has ended — show message */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-3">
              <VideoOff size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-300 text-sm font-medium">This interview has ended</p>
            <p className="text-gray-600 text-xs mt-1">Video session disconnected</p>
          </div>
        ) : loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <LoadingSpinner text="Connecting camera..." />
          </div>
        ) : videoUrl ? (
          <iframe
            src={videoUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write; encrypted-media"
            allowFullScreen={true}
            className="w-full h-full border-0"
            title="Video Call"
            onError={() => setIframeError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <AlertCircle size={24} className="mb-2" />
            <p className="text-xs">Video unavailable</p>
            <p className="text-[10px] text-gray-600 mt-1">No room code available</p>
          </div>
        )}

        {/* Iframe error overlay */}
        {iframeError && isInterviewActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80">
            <AlertCircle size={24} className="text-amber-400 mb-2" />
            <p className="text-gray-300 text-xs">Failed to load video</p>
            <button
              onClick={() => { setIframeError(false); setLoading(true); setTimeout(() => setLoading(false), 1000); }}
              className="mt-2 text-blue-400 text-xs hover:underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
