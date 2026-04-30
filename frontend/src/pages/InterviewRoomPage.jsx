import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import Navbar from '../components/Navbar';
import EditorPanel from '../components/EditorPanel';
import OutputPanel from '../components/OutputPanel';
import VideoPanel from '../components/VideoPanel';
import ControlBar from '../components/ControlBar';
import Timer from '../components/Timer';
import ParticipantsPanel from '../components/ParticipantsPanel';
import ProblemPanel from '../components/ProblemPanel';
import HRMonitorPanel from '../components/HRMonitorPanel';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function InterviewRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const {
    user, role, roomId: contextRoomId, roomCode, joinRoom, rejoinRoom,
    startTimer, isSocketConnected, isCandidateOnline, participants,
  } = useInterview();

  const [isRejoining, setIsRejoining] = useState(false);
  const [showCandidateJoinBanner, setShowCandidateJoinBanner] = useState(false);

  // Guard: redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    // Auto-rejoin if we have room data in localStorage but context lost it (e.g. refresh)
    if (!contextRoomId && roomId) {
      setIsRejoining(true);
      try {
        const savedRoom = JSON.parse(localStorage.getItem('codeit_room') || 'null');
        if (savedRoom && savedRoom.roomId === roomId) {
          rejoinRoom(savedRoom.roomId, savedRoom.roomCode, savedRoom.title, savedRoom.createdBy, user);
        } else {
          // No stored room data — try joining with basic info from URL
          joinRoom(roomId, roomId.split('-')[1]?.toUpperCase() || 'LIVE', 'Technical Interview');
        }
      } catch {
        joinRoom(roomId, roomId.split('-')[1]?.toUpperCase() || 'LIVE', 'Technical Interview');
      }
      setTimeout(() => setIsRejoining(false), 1000);
    }
  }, [user, contextRoomId, roomId]);

  // Auto-start timer when room loads
  useEffect(() => {
    const t = setTimeout(() => startTimer(), 1500);
    return () => clearTimeout(t);
  }, []);

  // Show banner for HR when candidate hasn't joined yet
  useEffect(() => {
    if (role === ROLES.HR) {
      setShowCandidateJoinBanner(!isCandidateOnline);
    }
  }, [role, isCandidateOnline]);

  if (!user || isRejoining) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="lg" text={isRejoining ? 'Reconnecting to room…' : 'Redirecting…'} />
      </div>
    );
  }

  const isHR = role === ROLES.HR;
  const candidateName = participants.find(p => p.role === ROLES.CANDIDATE)?.name;

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <Navbar showTimer />

      {/* Candidate join banner for HR */}
      {isHR && showCandidateJoinBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-center gap-2 text-amber-300 text-sm animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          ⏳ Waiting for {candidateName || 'candidate'} to join the interview...
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel: Problem + Video + Participants + Timer ─────────────── */}
        <aside className="w-64 xl:w-72 flex-shrink-0 border-r border-gray-800 bg-gray-900/40 overflow-y-auto p-3 space-y-3 hidden lg:block">
          <ProblemPanel />
          <VideoPanel />
          <ParticipantsPanel />
          <Timer />
        </aside>

        {/* ── Center: Editor / HR Monitor ──────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {isHR ? (
            <div className="flex-1 p-3 overflow-hidden bg-gray-950">
              <HRMonitorPanel />
            </div>
          ) : (
            <>
              {/* Editor takes remaining height above ControlBar */}
              <div className="flex-1 p-3 overflow-hidden">
                <EditorPanel />
              </div>
              {/* ControlBar sticks to bottom for candidates */}
              <ControlBar />
            </>
          )}
        </div>

        {/* ── Right Panel: Output ─────────────────────────────────────────────── */}
        {!isHR && (
          <aside className="w-72 xl:w-80 flex-shrink-0 border-l border-gray-800 p-3 hidden md:block overflow-hidden">
            <OutputPanel />
          </aside>
        )}
      </div>

      {/* Mobile bottom panels (stacked below editor on small screens) */}
      <div className="lg:hidden border-t border-gray-800 max-h-48 overflow-y-auto">
        <div className="p-3">
          {isHR ? <HRMonitorPanel /> : <OutputPanel />}
        </div>
      </div>
    </div>
  );
}
