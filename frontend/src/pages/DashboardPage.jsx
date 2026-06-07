import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Video, Clock, Users, CheckCircle2, XCircle,
  Copy, Check, X, AlertCircle, Calendar, Timer as TimerIcon, FileText
} from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES, ROOM_STATUSES, MOCK_ROOMS } from '../utils/constants';
import { generateRoomCode, copyToClipboard, timeAgo, getRoomInviteLink } from '../utils/helpers';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProblemCreatorModal from '../components/ProblemCreatorModal';

const statusVariantMap = {
  [ROOM_STATUSES.ACTIVE]: 'active',
  [ROOM_STATUSES.WAITING]: 'waiting',
  [ROOM_STATUSES.COMPLETED]: 'completed',
  [ROOM_STATUSES.CANCELLED]: 'cancelled',
};

function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-800 rounded w-1/2" />
        </div>
        <div className="h-5 w-16 bg-gray-800 rounded-full ml-2" />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="h-3 w-16 bg-gray-800 rounded" />
        <div className="h-3 w-12 bg-gray-800 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 bg-gray-800 rounded" />
        <div className="h-8 w-24 bg-gray-800 rounded-lg" />
      </div>
    </div>
  );
}

function CreateRoomModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [candidate, setCandidate] = useState('');
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) { setError('Room title is required.'); return; }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), candidate: candidate.trim(), duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create room');
      onCreate({ ...data, id: data._id });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-gray-100 font-semibold text-base">Create Interview Room</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Position / Title *</label>
            <input
              id="room-title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Candidate Name</label>
            <input
              id="room-candidate"
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
              placeholder="e.g. Riya Sharma"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Duration: <span className="text-blue-400 font-semibold">{duration} min</span>
            </label>
            <input
              type="range" min={15} max={120} step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>15 min</span><span>120 min</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={14} />{error}
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Plus} className="flex-1" loading={loading} onClick={handleCreate}>
            {loading ? 'Creating…' : 'Create Room'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, onEnter, onAddProblem }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { joinRoom } = useInterview();

  const handleCopy = async (e) => {
    e.stopPropagation();
    const ok = await copyToClipboard(getRoomInviteLink(room.code));
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const handleEnter = () => {
    if (room.status === ROOM_STATUSES.COMPLETED || room.status === ROOM_STATUSES.CANCELLED) {
      alert('This interview has ended and cannot be rejoined.');
      return;
    }
    joinRoom(room.id, room.code, room.title);
    navigate(`/room/${room.id}`);
  };

  const isActive = room.status === ROOM_STATUSES.ACTIVE;
  const isWaiting = room.status === ROOM_STATUSES.WAITING;
  const isEnded = room.status === ROOM_STATUSES.COMPLETED || room.status === ROOM_STATUSES.CANCELLED;

  return (
    <div className={`group bg-gray-900 border border-gray-800 ${isEnded ? 'opacity-60' : 'hover:border-gray-700 cursor-pointer hover:shadow-xl hover:shadow-black/20'} rounded-xl p-5 transition-all`} onClick={isEnded ? undefined : handleEnter}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-100 font-semibold text-base truncate">{room.title}</h3>
          {room.candidate && (
            <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1.5">
              <Users size={12} />
              {room.candidate}
            </p>
          )}
        </div>
        <Badge variant={statusVariantMap[room.status]} dot className="flex-shrink-0 ml-2">{room.status}</Badge>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
        <span className="flex items-center gap-1"><TimerIcon size={11} />{room.duration} min</span>
        <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(room.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-gray-800 border border-gray-700 px-2 py-1 rounded-md text-gray-300">{room.code}</code>
          <button onClick={handleCopy} className="p-1.5 rounded-md text-gray-600 hover:text-blue-400 border border-gray-800 hover:border-gray-700 transition-colors">
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isEnded ? (
            <span className="text-xs text-gray-500 italic px-2 py-1">
              {room.status === ROOM_STATUSES.COMPLETED ? 'Interview Ended' : 'Cancelled'}
            </span>
          ) : (isActive || isWaiting) && (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={FileText}
                onClick={(e) => { e.stopPropagation(); onAddProblem(room); }}
              >
                Problem
              </Button>
              <Button variant={isActive ? 'primary' : 'secondary'} size="sm" icon={Video} onClick={(e) => { e.stopPropagation(); handleEnter(); }}>
                {isActive ? 'Join Live' : 'Enter Room'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, role, setError } = useInterview();
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [problemModal, setProblemModal] = useState(null); // { roomId, room }

  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch rooms');
        setRooms(data.map(r => ({ ...r, id: r._id })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRooms(false);
      }
    };
    if (user && role === ROLES.HR) {
        fetchRooms();
    } else {
        setLoadingRooms(false);
    }
  }, [user, role, setError]);

  const handleCreateRoom = (newRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
  };

  const handleAddProblem = (room) => {
    setProblemModal({ roomId: room.id, room });
  };

  const activeCount = rooms.filter((r) => r.status === ROOM_STATUSES.ACTIVE).length;
  const waitingCount = rooms.filter((r) => r.status === ROOM_STATUSES.WAITING).length;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />
      {showCreateModal && (
        <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateRoom} />
      )}
      {problemModal && (
        <ProblemCreatorModal
          onClose={() => setProblemModal(null)}
          onSave={() => setProblemModal(null)}
          roomId={problemModal.roomId}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar rooms={rooms} onCreateRoom={() => setShowCreateModal(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, <span className="text-gray-300">{user?.name}</span></p>
            </div>
            <Button variant="primary" icon={Plus} onClick={() => setShowCreateModal(true)} id="dashboard-create-btn">
              New Room
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Rooms', value: rooms.length, icon: Video, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Active Now', value: activeCount, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Waiting', value: waitingCount, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Completed', value: rooms.filter((r) => r.status === ROOM_STATUSES.COMPLETED).length, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon size={16} className={stat.color} />
                  </div>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Rooms grid */}
          <div>
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
              All Rooms ({rooms.length})
            </h2>
            {loadingRooms ? (
              /* Skeleton loading cards */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : rooms.length === 0 ? (
              <div className="border-2 border-dashed border-gray-800 rounded-2xl py-20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center">
                  <Video size={28} className="text-gray-700" />
                </div>
                <div className="text-center">
                  <p className="text-gray-400 font-medium">No interview rooms yet</p>
                  <p className="text-gray-600 text-sm mt-1">Create your first room to get started</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setShowCreateModal(true)}>Create Room</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onAddProblem={handleAddProblem}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
