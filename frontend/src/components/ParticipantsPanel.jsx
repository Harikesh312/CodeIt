import React from 'react';
import { Users, Wifi, WifiOff, Clock } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import { getInitials, getAvatarColor } from '../utils/helpers';
import Badge from './ui/Badge';

function ParticipantRow({ participant }) {
  const initials = getInitials(participant.name);
  const bg = getAvatarColor(participant.name);
  const isHR = participant.role === ROLES.HR;
  const isOnline = participant.online !== false;

  const formatJoinTime = (joinedAt) => {
    if (!joinedAt) return '';
    const d = new Date(joinedAt);
    return d.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-800/60 transition-colors">
      <div className="relative flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: bg }}
        >
          {initials}
        </div>
        {/* Online dot */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${
            isOnline ? 'bg-emerald-500' : 'bg-gray-600'
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-gray-200 text-sm font-medium truncate">{participant.name}</p>
        <div className="flex items-center gap-2">
          <Badge variant={isHR ? 'hr' : 'candidate'} className="mt-0.5 text-[10px]">
            {isHR ? 'Interviewer' : 'Candidate'}
          </Badge>
          {participant.joinedAt && (
            <span className="text-[9px] text-gray-600 flex items-center gap-0.5 mt-0.5">
              <Clock size={8} />
              {formatJoinTime(participant.joinedAt)}
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        {isOnline ? (
          <Wifi size={12} className="text-emerald-500" />
        ) : (
          <WifiOff size={12} className="text-gray-600" />
        )}
      </div>
    </div>
  );
}

export default function ParticipantsPanel() {
  const { participants, user, role, isSocketConnected, isCandidateOnline, onlineCount } = useInterview();

  // Deduplicate: use socket participants as primary, add self only if not already present
  const selfInList = participants.some(
    (p) => p.name === user?.name && p.role === role
  );

  const allParticipants = selfInList
    ? participants
    : [{ id: 'self', name: user?.name || 'You', role, online: true, joinedAt: new Date().toISOString() }, ...participants];

  // Further deduplicate by name+role (in case of reconnection duplicates)
  const seen = new Set();
  const uniqueParticipants = allParticipants.filter((p) => {
    const key = `${p.name}-${p.role}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const displayOnlineCount = uniqueParticipants.filter((p) => p.online !== false).length;

  const isHR = role === ROLES.HR;
  const hasCandidateJoined = uniqueParticipants.some(p => p.role === ROLES.CANDIDATE);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
          <Users size={12} className="text-blue-400" />
          Participants
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">{displayOnlineCount} online</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSocketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'
            }`}
          />
        </div>
      </div>

      {/* Participant list */}
      <div className="p-2 space-y-0.5">
        {uniqueParticipants.map((p, idx) => (
          <ParticipantRow key={`${p.name}-${p.role}-${idx}`} participant={p} />
        ))}

        {/* Empty state for HR when no candidate */}
        {isHR && !hasCandidateJoined && (
          <div className="py-4 text-center">
            <div className="flex justify-center mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
              </span>
            </div>
            <p className="text-amber-400/80 text-xs font-medium">Candidate has not joined yet</p>
            <p className="text-gray-600 text-[10px] mt-0.5">Share the room code to invite</p>
          </div>
        )}

        {!isHR && uniqueParticipants.length === 1 && (
          <div className="py-3 text-center text-xs text-gray-600">
            Waiting for other participant to join…
          </div>
        )}
      </div>
    </div>
  );
}
