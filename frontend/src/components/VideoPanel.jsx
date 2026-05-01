import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Video, AlertCircle, VideoOff, Mic, MicOff, User, Maximize2, Minimize2 } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import socketService from '../services/socketService';
import { ROLES } from '../utils/constants';

export default function VideoPanel({ isMainPanel = false }) {
  const { roomCode, role, participants, user } = useInterview();
  const [isInterviewActive, setIsInterviewActive] = useState(true);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [scriptError, setScriptError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const jitsiContainerRef = useRef(null);
  const panelRef = useRef(null);

  // Determine the name to show on the screen (the other person)
  const otherParticipant = participants.find(p => p.role !== role);
  const displayName = otherParticipant 
    ? otherParticipant.name 
    : (role === ROLES.HR ? 'Candidate' : 'Interviewer');

  // Listen for interview_end to stop the video
  useEffect(() => {
    const onInterviewEnd = () => {
      setIsInterviewActive(false);
      setIsFullscreen(false);
    };

    socketService.on('interview_end', onInterviewEnd);
    return () => {
      socketService.off('interview_end', onInterviewEnd);
    };
  }, []);

  // Sync fullscreen state when user presses Escape to exit native fullscreen
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Allow Escape key to exit fullscreen overlay (fallback for non-native)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen && !document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen]);

  // Toggle fullscreen
  const handleFullscreenToggle = useCallback(() => {
    if (!isFullscreen) {
      // Enter fullscreen
      setIsFullscreen(true);
      if (panelRef.current?.requestFullscreen) {
        panelRef.current.requestFullscreen().catch(() => {
          // Fullscreen API denied — CSS fallback is already applied via isFullscreen state
        });
      }
    } else {
      // Exit fullscreen
      setIsFullscreen(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [isFullscreen]);

  // Initialize Jitsi manually (Audio only)
  useEffect(() => {
    if (!roomCode || !isInterviewActive) return;

    console.log("Starting Jitsi manual initialization for room:", roomCode);
    let api = null;
    let isMounted = true;

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
        if (isMounted) setScriptError(false);
        const JitsiMeetExternalAPI = await loadJitsiScript();

        if (!isMounted) return;

        if (!JitsiMeetExternalAPI) {
           throw new Error("JitsiMeetExternalAPI is undefined even after script load.");
        }

        if (!jitsiContainerRef.current) {
          return;
        }

        // Clear any existing iframes before creating a new one
        jitsiContainerRef.current.innerHTML = '';

        const domain = 'meet.jit.si';
        const options = {
          roomName: `CodeIt-Interview-${roomCode}`,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            prejoinConfig: {
              enabled: false,
            },
            lobby: {
              autoKnock: false,
              enableChat: false,
            },
            disableDeepLinking: true,
            disableInviteFunctions: true,
            doNotStoreRoom: true,
            enableNoisyMicDetection: false,
            hideConferenceSubject: false,
            hideConferenceTimer: false,
            subject: `CodeIt Interview - ${roomCode}`,
            defaultLocalDisplayName: user?.name || 'Participant',
            localSubject: user?.name || 'Participant',
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
            TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup', 'chat', 'tileview'],
            SHOW_CHROME_EXTENSION_BANNER: false,
            MOBILE_APP_PROMO: false,
            HIDE_INVITE_MORE_HEADER: true,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          },
          userInfo: {
            displayName: user?.name || (role === 'hr' ? 'Interviewer' : 'Candidate'),
            email: '',
          }
        };

        api = new JitsiMeetExternalAPI(domain, options);
        
        if (!isMounted) {
          api.dispose();
          return;
        }

        setJitsiApi(api);

        // Force display name after join in case prejoin page cached old name
        api.addListener('videoConferenceJoined', () => {
          if (!isMounted) return;
          api.executeCommand('displayName', user?.name || (role === 'hr' ? 'Interviewer' : 'Candidate'));
          api.isAudioMuted().then(muted => { if (isMounted) setAudioMuted(muted); });
          api.isVideoMuted().then(muted => { if (isMounted) setVideoMuted(muted); });
        });

        api.addListener('audioMuteStatusChanged', (payload) => {
          if (isMounted) setAudioMuted(payload.muted);
        });

        api.addListener('videoMuteStatusChanged', (payload) => {
          if (isMounted) setVideoMuted(payload.muted);
        });

      } catch (err) {
        console.error("Error during Jitsi initialization:", err);
        if (isMounted) setScriptError(true);
      }
    };

    initMeeting();

    return () => {
      isMounted = false;
      if (api) {
        api.dispose();
      }
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = '';
      }
    };
  }, [roomCode, isInterviewActive, user?.name, role]);

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

  // Styles for fullscreen mode
  const panelStyle = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    borderRadius: 0,
    border: 'none',
  } : {};

  return (
    <div
      ref={panelRef}
      className={`bg-gray-900 flex flex-col ${isFullscreen ? '' : 'border border-gray-800 rounded-xl'} ${!isFullscreen && !isMainPanel ? 'h-[320px]' : ''} ${!isFullscreen && isMainPanel ? 'h-full' : ''}`}
      style={panelStyle}
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider p-3 border-b border-gray-800 shrink-0">
        <Video size={12} className="text-blue-400" />
        {isFullscreen ? 'Meeting — Full Screen' : 'Audio Call'}
        <span className="ml-auto flex items-center gap-2">
          {isInterviewActive && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-[10px] font-normal normal-case">Live</span>
            </span>
          )}
          {roomCode && isInterviewActive && (
            <button
              onClick={handleFullscreenToggle}
              className="p-1 rounded-md transition-colors bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
              title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}
        </span>
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
            {/* Audio Profile UI — hidden during fullscreen or main panel */}
            {!isFullscreen && !isMainPanel && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700 shadow-lg">
                  <User size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-200 font-medium text-sm">{displayName}</p>
                
                <p className="text-emerald-500 text-xs mt-2 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {audioMuted ? 'Audio Muted' : 'Audio Active'}
                </p>

                <button
                  onClick={handleFullscreenToggle}
                  className="mt-4 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-colors"
                >
                  <Maximize2 size={12} />
                  Open Full Screen
                </button>
              </div>
            )}

            {/* Jitsi container — visible and interactive in fullscreen or main panel */}
            <div
              className={isFullscreen || isMainPanel
                ? 'absolute inset-0 w-full h-full'
                : 'absolute opacity-0 pointer-events-none w-[1px] h-[1px]'
              }
            >
              <div ref={jitsiContainerRef} className="w-full h-full border-none" />
            </div>
          </>
        )}
      </div>

      {/* Control Bar */}
      {roomCode && isInterviewActive && (
        <div className={`bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-4 shrink-0 z-20 relative ${isFullscreen ? 'h-14 rounded-none' : 'h-9 rounded-b-xl'}`}>
          <button 
            className={`rounded-lg transition-colors ${isFullscreen ? 'p-2.5' : 'p-1.5'} ${audioMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={handleAudioToggle}
            title="Toggle Audio"
          >
            {audioMuted ? <MicOff size={isFullscreen ? 20 : 16} /> : <Mic size={isFullscreen ? 20 : 16} />}
          </button>
          <button 
            className={`rounded-lg transition-colors ${isFullscreen ? 'p-2.5' : 'p-1.5'} ${videoMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={handleVideoToggle}
            title="Toggle Video"
          >
            {videoMuted ? <VideoOff size={isFullscreen ? 20 : 16} /> : <Video size={isFullscreen ? 20 : 16} />}
          </button>
          <button 
            className={`rounded-lg transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600 ${isFullscreen ? 'p-2.5' : 'p-1.5'}`}
            onClick={handleFullscreenToggle}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? <Minimize2 size={isFullscreen ? 20 : 16} /> : <Maximize2 size={isFullscreen ? 20 : 16} />}
          </button>
        </div>
      )}
    </div>
  );
}
