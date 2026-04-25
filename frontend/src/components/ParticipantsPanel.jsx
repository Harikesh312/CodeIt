import React, { useState } from 'react';
import { Users, Wifi, WifiOff } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import { getInitials, getAvatarColor } from '../utils/helpers';
import Badge from './ui/Badge';

function ParticipantRow({ participant }) {
  const initials = getInitials(participant.name);
  const bg = getAvatarColor(participant.name);
  const isHR = participant.role === ROLES.HR;
  const isOnline = participant.online !== false;

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
        <Badge variant={isHR ? 'hr' : 'candidate'} className="mt-0.5 text-[10px]">
          {isHR ? 'Interviewer' : 'Candidate'}
        </Badge>
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
  const { participants, user, role, isSocketConnected } = useInterview();

  // Always show self as first participant
  const self = { id: 'self', name: user?.name || 'You', role, online: true };
  const allParticipants = [self, ...participants.filter((p) => p.id !== 'self')];
  const onlineCount = allParticipants.filter((p) => p.online !== false).length;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
          <Users size={12} className="text-blue-400" />
          Participants
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">{onlineCount} online</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSocketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'
            }`}
          />
        </div>
      </div>

      {/* Participant list */}
      <div className="p-2 space-y-0.5">
        {allParticipants.map((p) => (
          <ParticipantRow key={p.id || p.name} participant={p} />
        ))}

        {allParticipants.length === 1 && (
          <div className="py-3 text-center text-xs text-gray-600">
            Waiting for other participant to join…
          </div>
        )}
      </div>
    </div>
  );
}
