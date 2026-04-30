// ─────────────────────────────────────────────────────────────────────────────
// constants.js – App-wide constants
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { SiJavascript, SiPython, SiCplusplus, SiC } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

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
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript', icon: <SiJavascript className="text-yellow-400" /> },
  { id: 'python',     label: 'Python',     monacoId: 'python',     icon: <SiPython className="text-blue-400" /> },
  { id: 'java',       label: 'Java',       monacoId: 'java',       icon: <FaJava className="text-orange-500" /> },
  { id: 'cpp',        label: 'C++',        monacoId: 'cpp',        icon: <SiCplusplus className="text-blue-500" /> },
  { id: 'c',          label: 'C',          monacoId: 'c',          icon: <SiC className="text-blue-600" /> },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0]; // JavaScript

export const DEFAULT_CODE_TEMPLATES = {
  javascript: `// JavaScript Solution\nconst readline = require('readline');\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nrl.on('line', (line) => {\n    console.log(solution(line));\n});\n\nfunction solution(input) {\n    // Write your code here\n    return input;\n}`,
  python: `# Python Solution\nimport sys\n\ndef solution(input_val):\n    # Write your code here\n    return input_val\n\nif __name__ == '__main__':\n    input_val = sys.stdin.read().strip()\n    if input_val:\n        print(solution(input_val))`,
  java: `// Java Solution\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String input = sc.nextLine();\n            System.out.println(input);\n        }\n    }\n}`,
  cpp: `// C++ Solution\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string input;\n    if (getline(cin, input)) {\n        cout << input << endl;\n    }\n    return 0;\n}`,
  c: `// C Solution\n#include <stdio.h>\n\nint main() {\n    char input[256];\n    if (fgets(input, sizeof(input), stdin)) {\n        printf("%s", input);\n    }\n    return 0;\n}`,
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
