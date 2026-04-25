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

const MOCK_OUTPUTS = {
  javascript: `Hello, CodeIt!\n✓ Executed successfully (0ms)`,
  typescript: `Hello, CodeIt!\n✓ Executed successfully (0ms)`,
  python: `Hello, CodeIt!\n✓ Executed successfully (0ms)`,
  java: `Hello, CodeIt!\n✓ Executed successfully (0ms)`,
  cpp: `Hello, CodeIt!\n✓ Executed successfully (0ms)`,
  go: `Hello, CodeIt!\n✓ Executed successfully (0ms)`,
  rust: `Hello, CodeIt!\n✓ Executed successfully (0ms)`,
};

/**
 * Run code in the specified language.
 * Currently returns a mock output after a simulated delay.
 *
 * @param {string} language  – One of the LANGUAGES[].id values
 * @param {string} code      – Source code to execute
 * @returns {Promise<{ output: string; error: boolean; executionTime: number }>}
 */
export async function runCode(language, code) {
  // Simulate network/execution delay
  const delay = Math.floor(Math.random() * 800) + 400;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Simulate occasional error for demo purposes
  const forceError = code.includes('throw') || code.includes('raise') || code.includes('panic');

  if (forceError) {
    return {
      output: `RuntimeError: Unhandled exception in ${language} execution.\n  at line 3: intentional error thrown`,
      error: true,
      executionTime: delay,
    };
  }

  return {
    output: MOCK_OUTPUTS[language] ?? `Output for ${language}:\n${code.slice(0, 100)}`,
    error: false,
    executionTime: delay,
  };
}

/**
 * Submit code for final evaluation.
 * TODO: Replace with a real submission endpoint that runs full test cases.
 *
 * @param {string} language
 * @param {string} code
 * @param {string} roomId
 * @returns {Promise<{ success: boolean; message: string }>}
 */
export async function submitCode(language, code, roomId) {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  console.log(`[codeRunnerService] submit → room: ${roomId}, language: ${language}`);
  return {
    success: true,
    message: 'Code submitted successfully! The interviewer has been notified.',
  };
}
