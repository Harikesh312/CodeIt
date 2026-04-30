// ─────────────────────────────────────────────────────────────────────────────
// constants.js – App-wide constants
// ─────────────────────────────────────────────────────────────────────────────

export const ROLES = {
  HR: 'hr',
  CANDIDATE: 'candidate',
};

export const ROOM_STATUSES = {
  WAITING: 'waiting',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript', icon: '🟨' },
  { id: 'python',     label: 'Python',     monacoId: 'python',     icon: '🐍' },
  { id: 'java',       label: 'Java',       monacoId: 'java',       icon: '☕' },
  { id: 'cpp',        label: 'C++',        monacoId: 'cpp',        icon: '⚙️' },
  { id: 'c',          label: 'C',          monacoId: 'c',          icon: '🔵' },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0]; // JavaScript

export const DEFAULT_CODE_TEMPLATES = {
  javascript: `// JavaScript Solution\nfunction solution(input) {\n  // Write your code here\n  return input;\n}\n\nconsole.log(solution("Hello, CodeIt!"));`,
  python: `# Python Solution\ndef solution(input_val):\n    # Write your code here\n    return input_val\n\nprint(solution("Hello, CodeIt!"))`,
  java: `// Java Solution\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println("Hello, CodeIt!");\n    }\n}`,
  cpp: `// C++ Solution\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, CodeIt!" << endl;\n    return 0;\n}`,
  c: `// C Solution\n#include <stdio.h>\n\nint main() {\n    printf("Hello, CodeIt!\\n");\n    return 0;\n}`,
};

export const INTERVIEW_DURATION_MINUTES = 60;

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  // Room
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  ROOM_UPDATED: 'room_updated',
  // Editor
  CODE_CHANGE: 'code_change',
  LANGUAGE_CHANGE: 'language_change',
  // Execution
  RUN_CODE: 'run_code',
  CODE_OUTPUT: 'code_output',
  // Participants
  PARTICIPANT_JOINED: 'participant_joined',
  PARTICIPANT_LEFT: 'participant_left',
  // Interview
  INTERVIEW_START: 'interview_start',
  INTERVIEW_END: 'interview_end',
  TIMER_SYNC: 'timer_sync',
};

export const MOCK_ROOMS = [
  {
    id: 'room-001',
    code: 'ABC123',
    title: 'Senior Frontend Engineer',
    candidate: 'Riya Sharma',
    status: ROOM_STATUSES.ACTIVE,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    duration: 60,
  },
  {
    id: 'room-002',
    code: 'XYZ789',
    title: 'Full Stack Developer',
    candidate: 'Arjun Mehta',
    status: ROOM_STATUSES.WAITING,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    duration: 45,
  },
  {
    id: 'room-003',
    code: 'DEF456',
    title: 'Backend Engineer',
    candidate: 'Priya Nair',
    status: ROOM_STATUSES.COMPLETED,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    duration: 60,
  },
];
