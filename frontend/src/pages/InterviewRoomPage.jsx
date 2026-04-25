import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import Navbar from '../components/Navbar';
import EditorPanel from '../components/EditorPanel';
import OutputPanel from '../components/OutputPanel';
import VideoPanel from '../components/VideoPanel';
import ControlBar from '../components/ControlBar';
import Timer from '../components/Timer';
import ParticipantsPanel from '../components/ParticipantsPanel';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function InterviewRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, roomId: contextRoomId, joinRoom, startTimer } = useInterview();

  // Guard: redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
      return;
    }
    // Auto-join if navigated directly via URL (e.g., refresh)
    if (!contextRoomId && roomId) {
      joinRoom(roomId, roomId.split('-')[1]?.toUpperCase() || 'LIVE', 'Technical Interview');
    }
  }, [user, contextRoomId, roomId]);

  // Auto-start timer when room loads
  useEffect(() => {
    const t = setTimeout(() => startTimer(), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!user) {
    return <LoadingSpinner fullScreen text="Redirecting…" />;
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <Navbar showTimer />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel: Video + Participants + Timer ───────────────────────── */}
        <aside className="w-64 xl:w-72 flex-shrink-0 border-r border-gray-800 bg-gray-900/40 overflow-y-auto p-3 space-y-3 hidden lg:block">
          <VideoPanel />
          <ParticipantsPanel />
          <Timer />
        </aside>

        {/* ── Center: Editor ─────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Editor takes remaining height above ControlBar */}
          <div className="flex-1 p-3 overflow-hidden">
            <EditorPanel />
          </div>
          {/* ControlBar sticks to bottom */}
          <ControlBar />
        </div>

        {/* ── Right Panel: Output ─────────────────────────────────────────────── */}
        <aside className="w-72 xl:w-80 flex-shrink-0 border-l border-gray-800 p-3 hidden md:block overflow-hidden">
          <OutputPanel />
        </aside>
      </div>

      {/* Mobile bottom panels (stacked below editor on small screens) */}
      <div className="lg:hidden border-t border-gray-800 max-h-48 overflow-y-auto">
        <div className="p-3">
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}
