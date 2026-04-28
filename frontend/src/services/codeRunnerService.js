// ─────────────────────────────────────────────────────────────────────────────
// codeRunnerService.js – Code execution stub
//
// HOW TO PLUG IN A REAL JUDGE:
//   Option A – Judge0 API (self-hosted or hosted):
//     const res = await fetch('https://judge0.example.com/submissions', { ... });
//   Option B – Custom backend endpoint:
//     const res = await fetch(`${API_URL}/api/run`, { method: 'POST', body: JSON.stringify({ language, code }) });
//
// Replace runCode() body below with the real implementation.
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to get the JWT token.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Run code in the specified language via the backend.
 *
 * @param {string} language  – One of the LANGUAGES[].id values
 * @param {string} code      – Source code to execute
 * @param {string} roomId    - Current room ID (optional for just running)
 * @returns {Promise<{ output: string; error: boolean; executionTime: number }>}
 */
export async function runCode(language, code, roomId = null) {
  try {
    const res = await fetch(`${API_URL}/code/run`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ language, code, roomId }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    return {
      output: `Error executing code: ${error.message}`,
      error: true,
      executionTime: 0,
    };
  }
}

/**
 * Submit code for final evaluation.
 *
 * @param {string} language
 * @param {string} code
 * @param {string} roomId
 * @returns {Promise<{ success: boolean; message: string }>}
 */
export async function submitCode(language, code, roomId) {
  try {
    const res = await fetch(`${API_URL}/code/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ language, code, roomId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Server error: ${res.status}`);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
