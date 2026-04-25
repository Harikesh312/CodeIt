import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Video, Clock, Users, CheckCircle2,
  XCircle, Copy, Check, ChevronRight, Trash2
} from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROOM_STATUSES, MOCK_ROOMS } from '../utils/constants';
import { generateRoomCode, copyToClipboard, timeAgo, getRoomInviteLink } from '../utils/helpers';
import Badge from './ui/Badge';
import Button from './ui/Button';

const statusVariantMap = {
  [ROOM_STATUSES.ACTIVE]: 'active',
  [ROOM_STATUSES.WAITING]: 'waiting',
  [ROOM_STATUSES.COMPLETED]: 'completed',
  [ROOM_STATUSES.CANCELLED]: 'cancelled',
};

const statusIcon = {
  [ROOM_STATUSES.ACTIVE]: <Video size={12} />,
  [ROOM_STATUSES.WAITING]: <Clock size={12} />,
  [ROOM_STATUSES.COMPLETED]: <CheckCircle2 size={12} />,
  [ROOM_STATUSES.CANCELLED]: <XCircle size={12} />,
};

export default function Sidebar({ rooms = MOCK_ROOMS, onCreateRoom }) {
  const { sidebarOpen, joinRoom, user } = useInterview();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  if (!sidebarOpen) return null;

  const handleCopy = async (e, room) => {
    e.stopPropagation();
    const link = getRoomInviteLink(room.code);
    const ok = await copyToClipboard(link);
    if (ok) {
      setCopiedCode(room.code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleEnterRoom = (room) => {
    joinRoom(room.id, room.code, room.title);
    navigate(`/room/${room.id}`);
  };

  return (
    <aside className="w-64 min-h-[calc(100vh-3.5rem)] bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <Button
          variant="primary"
          icon={Plus}
          className="w-full"
          onClick={onCreateRoom}
          id="create-room-btn"
        >
          Create New Room
        </Button>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-3">
          Interview Rooms ({rooms.length})
        </p>

        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-3">
              <Users size={22} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm">No rooms yet</p>
            <p className="text-gray-600 text-xs mt-1">Create a room to get started</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="group p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
              onClick={() => handleEnterRoom(room)}
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-gray-200 text-sm font-medium leading-tight line-clamp-2">
                  {room.title}
                </p>
                <ChevronRight
                  size={14}
                  className="text-gray-600 group-hover:text-blue-400 flex-shrink-0 mt-0.5 transition-colors"
                />
              </div>

              {/* Candidate */}
              {room.candidate && (
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-4 h-4 rounded-full bg-violet-600/40 flex items-center justify-center">
                    <span className="text-violet-300 text-[8px] font-bold">
                      {room.candidate[0]}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs truncate">{room.candidate}</span>
                </div>
              )}

              {/* Status + code row */}
              <div className="flex items-center justify-between">
                <Badge variant={statusVariantMap[room.status]} dot>
                  {statusIcon[room.status]}
                  {room.status}
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-xs font-mono">{room.code}</span>
                  <button
                    onClick={(e) => handleCopy(e, room)}
                    className="p-1 rounded text-gray-600 hover:text-blue-400 transition-colors"
                    title="Copy invite link"
                  >
                    {copiedCode === room.code ? (
                      <Check size={11} className="text-emerald-400" />
                    ) : (
                      <Copy size={11} />
                    )}
                  </button>
                </div>
              </div>

              {/* Time */}
              <p className="text-gray-600 text-xs mt-2">{timeAgo(room.createdAt)}</p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Users size={12} />
          <span>Logged in as <span className="text-gray-300">{user?.name}</span></span>
        </div>
      </div>
    </aside>
  );
}
