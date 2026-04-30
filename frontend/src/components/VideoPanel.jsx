import React, { useState, useEffect, useRef } from 'react';
import { Video, AlertCircle, VideoOff, Mic, MicOff, User } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import socketService from '../services/socketService';
import { ROLES } from '../utils/constants';

export default function VideoPanel() {
  const { roomCode, role, participants } = useInterview();
  const [isInterviewActive, setIsInterviewActive] = useState(true);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true); // Default true since video is hidden
  const [scriptError, setScriptError] = useState(false);
  
  const jitsiContainerRef = useRef(null);

  // Determine the name to show on the screen (the other person)
  const otherParticipant = participants.find(p => p.role !== role);
  const displayName = otherParticipant 
    ? otherParticipant.name 
    : (role === ROLES.HR ? 'Candidate' : 'Interviewer');

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

  // Initialize Jitsi manually (Audio only)
  useEffect(() => {
    if (!roomCode || !isInterviewActive) return;

    console.log("Starting Jitsi manual initialization for room:", roomCode);
    let api = null;

    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(window.JitsiMeetExternalAPI);
          return;
        }

        let tempAmd = null;
        if (typeof window.define === 'function' && window.define.amd) {
          tempAmd = window.define.amd;
          window.define.amd = null;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => {
          if (tempAmd && typeof window.define === 'function') {
            window.define.amd = tempAmd;
          }
          resolve(window.JitsiMeetExternalAPI);
        };
        script.onerror = (err) => {
          if (tempAmd && typeof window.define === 'function') {
            window.define.amd = tempAmd;
          }
          reject(err);
        };
        document.body.appendChild(script);
      });
    };

    const initMeeting = async () => {
      try {
        setScriptError(false);
        const JitsiMeetExternalAPI = await loadJitsiScript();

        if (!JitsiMeetExternalAPI) {
           throw new Error("JitsiMeetExternalAPI is undefined even after script load.");
        }

        if (!jitsiContainerRef.current) {
          return;
        }

        const domain = 'meet.jit.si';
        const options = {
          roomName: `CodeIt-Interview-${roomCode}`,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: true, // Force video off
            prejoinPageEnabled: false,
            disableDeepLinking: true,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
            TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup', 'chat'], // Re-added camera to toolbar
          },
          userInfo: {
            displayName: 'Participant'
          }
        };

        api = new JitsiMeetExternalAPI(domain, options);
        setJitsiApi(api);

        api.addListener('videoConferenceJoined', () => {
          api.isAudioMuted().then(muted => setAudioMuted(muted));
          api.isVideoMuted().then(muted => setVideoMuted(muted));
        });

        api.addListener('audioMuteStatusChanged', (payload) => {
          setAudioMuted(payload.muted);
        });

        api.addListener('videoMuteStatusChanged', (payload) => {
          setVideoMuted(payload.muted);
        });

      } catch (err) {
        console.error("Error during Jitsi initialization:", err);
        setScriptError(true);
      }
    };

    initMeeting();

    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, [roomCode, isInterviewActive]);

  const handleAudioToggle = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleAudio');
    }
  };

  const handleVideoToggle = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleVideo');
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-[320px]">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider p-3 border-b border-gray-800 shrink-0">
        <Video size={12} className="text-blue-400" />
        Audio Call
        {isInterviewActive && (
          <span className="ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-normal normal-case">Live</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden bg-black/50">
        {!isInterviewActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm z-10">
            <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-3">
              <VideoOff size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-300 text-sm font-medium">This interview has ended</p>
            <p className="text-gray-600 text-xs mt-1">Audio session disconnected</p>
          </div>
        ) : !roomCode ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <AlertCircle size={24} className="mb-2" />
            <p className="text-xs">Audio unavailable</p>
            <p className="text-[10px] text-gray-600 mt-1">No room code available</p>
          </div>
        ) : scriptError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-900 z-10 p-4 text-center">
            <AlertCircle size={24} className="mb-2 text-red-500" />
            <p className="text-sm text-gray-300">Failed to load audio service</p>
            <p className="text-xs text-gray-500 mt-2">Could not connect to meeting servers.</p>
          </div>
        ) : (
          <>
            {/* Audio Profile UI */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700 shadow-lg">
                <User size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-200 font-medium text-sm">{displayName}</p>
              
              <p className="text-emerald-500 text-xs mt-2 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {audioMuted ? 'Audio Muted' : 'Audio Active'}
              </p>
            </div>

            {/* Hidden Jitsi instance for audio */}
            <div className="absolute opacity-0 pointer-events-none w-[1px] h-[1px]">
              <div ref={jitsiContainerRef} className="w-full h-full border-none" />
            </div>
          </>
        )}
      </div>

      {/* Control Bar */}
      {roomCode && isInterviewActive && (
        <div className="h-9 bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-4 shrink-0 rounded-b-xl z-20 relative">
          <button 
            className={`p-1.5 rounded-lg transition-colors ${audioMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={handleAudioToggle}
            title="Toggle Audio"
          >
            {audioMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button 
            className={`p-1.5 rounded-lg transition-colors ${videoMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={handleVideoToggle}
            title="Toggle Video"
          >
            {videoMuted ? <VideoOff size={16} /> : <Video size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
