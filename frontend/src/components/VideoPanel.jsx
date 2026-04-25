import React, { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, Users } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { ROLES } from '../utils/constants';
import { getInitials, getAvatarColor } from '../utils/helpers';

function VideoTile({ participant, isLocal = false }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false); // default camera off (no WebRTC yet)

  const initials = getInitials(participant?.name || '?');
  const avatarBg = getAvatarColor(participant?.name || '');
  const roleLabel = participant?.role === ROLES.HR ? 'Interviewer' : 'Candidate';

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 border border-gray-700 group">
      {/* Video placeholder */}
      {camOn ? (
        /* When WebRTC is connected, replace this div with a <video> element */
        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
          {/* TODO: <video ref={videoRef} autoPlay muted={isLocal} className="w-full h-full object-cover" /> */}
          <p className="text-gray-500 text-xs">Camera stream here</p>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
            style={{ backgroundColor: avatarBg }}
          >
            {initials}
          </div>
          <p className="text-gray-400 text-xs">{participant?.name || 'Waiting…'}</p>
        </div>
      )}

      {/* Name bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-white text-xs font-medium truncate max-w-20">
            {participant?.name || 'Connecting…'}
          </span>
          {isLocal && (
            <span className="text-gray-400 text-[10px]">(You)</span>
          )}
        </div>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
          participant?.role === ROLES.HR
            ? 'bg-blue-500/30 text-blue-300'
            : 'bg-violet-500/30 text-violet-300'
        }`}>
          {roleLabel}
        </span>
      </div>

      {/* Controls (visible on hover) */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setMicOn((v) => !v)}
          className={`p-1 rounded-md backdrop-blur-sm transition-colors ${
            micOn ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80' : 'bg-red-600/80 text-white'
          }`}
          title={micOn ? 'Mute' : 'Unmute'}
        >
          {micOn ? <Mic size={11} /> : <MicOff size={11} />}
        </button>
        <button
          onClick={() => setCamOn((v) => !v)}
          className={`p-1 rounded-md backdrop-blur-sm transition-colors ${
            camOn ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80' : 'bg-red-600/80 text-white'
          }`}
          title={camOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {camOn ? <Video size={11} /> : <VideoOff size={11} />}
        </button>
      </div>

      {/* Mic indicator */}
      {!micOn && (
        <div className="absolute top-2 left-2 bg-red-600/80 p-1 rounded-md backdrop-blur-sm">
          <MicOff size={10} className="text-white" />
        </div>
      )}
    </div>
  );
}

export default function VideoPanel() {
  const { participants, user, role } = useInterview();

  // Build display participants (current user + remote)
  const self = { name: user?.name, role, online: true };
  const remote = participants.find((p) => p.role !== role) || null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
        <Video size={12} className="text-blue-400" />
        Video
        {/* WebRTC placeholder notice */}
        <span className="ml-auto text-gray-700 normal-case font-normal tracking-normal">
          {/* TODO: Plug in WebRTC streams here */}
          Preview only
        </span>
      </div>

      {/* Self tile */}
      <VideoTile participant={self} isLocal />

      {/* Remote tile */}
      {remote ? (
        <VideoTile participant={remote} />
      ) : (
        <div className="aspect-video rounded-lg bg-gray-800/50 border border-dashed border-gray-700 flex flex-col items-center justify-center gap-2">
          <Users size={20} className="text-gray-600" />
          <p className="text-gray-600 text-xs">Waiting for other participant…</p>
        </div>
      )}
    </div>
  );
}
