const fetch = require('node-fetch');

const PISTON_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

const languageMap = {
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.50.0' },
};

/**
 * Executes code using the Piston API.
 * @param {string} frontendLangId - Language ID from the frontend (e.g. 'javascript', 'cpp')
 * @param {string} code - The source code to execute
 * @returns {Promise<{ output: string, error: boolean, executionTime: number, language: string }>}
 */
const runCode = async (frontendLangId, code) => {
  const pistonConfig = languageMap[frontendLangId];

  if (!pistonConfig) {
    throw new Error(`Language '${frontendLangId}' is not supported.`);
  }

  const startTime = Date.now();

  try {
    const response = await fetch(`${PISTON_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: pistonConfig.language,
        version: pistonConfig.version,
        files: [{ name: 'main', content: code }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.statusText}`);
    }

    const result = await response.json();
    const executionTime = Date.now() - startTime;

    // Check if the execution had a non-zero exit code or stderr output
    const isError = result.run.code !== 0 || !!result.run.stderr;
    
    // Combine stdout and stderr for the final output, fallback to error message if compilation failed
    const output = result.run.stdout || result.run.stderr || (result.compile && result.compile.stderr) || 'No output generated.';

    return {
      output,
      error: isError,
      executionTime,
      language: frontendLangId,
    };
  } catch (error) {
    console.error('Error executing code:', error);
    return {
      output: `Runtime Error: ${error.message}`,
      error: true,
      executionTime: Date.now() - startTime,
      language: frontendLangId,
    };
  }
};

module.exports = {
  runCode,
  languageMap,
};
