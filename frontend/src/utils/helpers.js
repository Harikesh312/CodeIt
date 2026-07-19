// ─────────────────────────────────────────────────────────────────────────────
// helpers.js – Utility functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format seconds into MM:SS display string.
 * @param {number} totalSeconds
 * @returns {string} e.g. "04:35"
 */
export function formatTime(totalSeconds) {
  const m = Math.floor(Math.abs(totalSeconds) / 60);
  const s = Math.abs(totalSeconds) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Generate a random 6-character alphanumeric room code.
 * @returns {string} e.g. "A3K9MZ"
 */
export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

/**
 * Copy text to clipboard, returns a promise resolving to boolean.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get initials from a full name (max 2 chars).
 * @param {string} name
 * @returns {string} e.g. "RS" from "Riya Sharma"
 */
export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Get a deterministic avatar color based on name.
 * @param {string} name
 * @returns {string} Tailwind-compatible inline color string
 */
export function getAvatarColor(name = '') {
  const colors = [
    '#6366f1', '#7c3aed', '#ec4899', '#f59e0b',
    '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

/**
 * Relative time format, e.g. "2 minutes ago".
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function timeAgo(dateInput) {
  const date = new Date(dateInput);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Generate a unique room invite link.
 * @param {string} roomCode
 * @returns {string}
 */
export function getRoomInviteLink(roomCode) {
  return `${window.location.origin}/join?code=${roomCode}`;
}
