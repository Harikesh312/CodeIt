// ─── Wandbox API — Free, no API key required ────────────────────────────────
// Docs: https://github.com/melpon/wandbox/blob/master/kennel2/API.md
// POST https://wandbox.org/api/compile/json
// No authentication needed.

let fetch;
const getFetch = async () => {
  if (!fetch) {
    const mod = await import('node-fetch');
    fetch = mod.default;
  }
  return fetch;
};

const WANDBOX_URL = 'https://wandbox.org/api/compile.json';

// Map frontend language IDs → Wandbox compiler names
const languageMap = {
  javascript: { compiler: 'nodejs-20.17.0', label: 'Node.js 20.17.0' },
  python:     { compiler: 'cpython-3.12.7', label: 'CPython 3.12.7' },
  java:       { compiler: 'openjdk-jdk-22+36', label: 'OpenJDK 22' },
  cpp:        { compiler: 'gcc-13.2.0', label: 'GCC 13.2.0 (C++)' },
  c:          { compiler: 'gcc-13.2.0-c', label: 'GCC 13.2.0 (C)' },
};

/**
 * Executes code via Wandbox compile API.
 *
 * @param {string} frontendLangId - One of: javascript, python, java, cpp, c
 * @param {string} code           - Source code
 * @param {string} stdin          - Standard input (optional)
 * @returns {{ output: string, error: boolean, executionTime: number, language: string }}
 */
const runCode = async (frontendLangId, code, stdin = '') => {
  const langConfig = languageMap[frontendLangId];

  if (!langConfig) {
    throw new Error(`Language '${frontendLangId}' is not supported.`);
  }

  const startTime = Date.now();

  try {
    const fetch = await getFetch();

    const body = {
      compiler: langConfig.compiler,
      code,
      stdin: stdin || '',
    };

    const response = await fetch(WANDBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Wandbox API error (${response.status}): ${errText}`);
    }

    const result = await response.json();
    const executionTime = Date.now() - startTime;

    // Wandbox response:
    //   program_output  - stdout of the program
    //   program_error   - stderr of the program
    //   compiler_output - compiler stdout
    //   compiler_error  - compiler stderr (compilation errors)
    //   compiler_message - combined compiler output
    //   status          - exit code ("0" = success)
    //   signal          - signal name if killed

    const stdout = result.program_output || '';
    const stderr = result.program_error || '';
    const compileErr = result.compiler_error || '';
    const compileMsg = result.compiler_message || '';

    const exitCode = parseInt(result.status, 10);
    const isError = exitCode !== 0 || !!result.signal;

    let output;
    if (compileErr && !stdout) {
      // Compilation failed
      output = compileErr;
    } else if (stdout) {
      output = stdout + (stderr ? `\n${stderr}` : '');
    } else if (stderr) {
      output = stderr;
    } else if (compileMsg) {
      output = compileMsg;
    } else {
      output = 'No output generated.';
    }

    // Clean trailing newlines
    output = output.replace(/\n$/, '');

    return {
      output,
      error: isError,
      executionTime,
      language: frontendLangId,
      status: result.signal ? `Killed (${result.signal})` : (isError ? 'Error' : 'Success'),
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

/**
 * Runs code against a set of test cases using Wandbox.
 */
const runCodeWithTestCases = async (frontendLangId, code, testCases) => {
  const results = [];
  let totalPassed = 0;
  let totalExecutionTime = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const startTime = Date.now();

    try {
      const langConfig = languageMap[frontendLangId];
      if (!langConfig) {
        throw new Error(`Language '${frontendLangId}' is not supported.`);
      }

      const fetch = await getFetch();

      const body = {
        compiler: langConfig.compiler,
        code,
        stdin: tc.input || '',
      };

      const response = await fetch(WANDBOX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Wandbox API error (${response.status}): ${errText}`);
      }

      const result = await response.json();
      const executionTime = Date.now() - startTime;
      totalExecutionTime += executionTime;

      const stdout = result.program_output || '';
      const stderr = result.program_error || '';
      const compileErr = result.compiler_error || '';

      const exitCode = parseInt(result.status, 10);
      const hasError = exitCode !== 0 || !!result.signal;

      const actualOutput = stdout.trim();
      const expectedOutput = (tc.expectedOutput || '').trim();
      const passed = !hasError && actualOutput === expectedOutput;

      if (passed) totalPassed++;

      const testResult = {
        testCaseNumber: i + 1,
        passed,
        executionTime,
        isHidden: tc.isHidden || false,
        error: hasError,
        errorMessage: hasError ? (compileErr || stderr || result.signal || null) : null,
      };

      if (!tc.isHidden) {
        testResult.input = tc.input;
        testResult.expectedOutput = tc.expectedOutput;
        testResult.actualOutput = actualOutput;
      }

      results.push(testResult);
    } catch (error) {
      const executionTime = Date.now() - startTime;
      totalExecutionTime += executionTime;

      results.push({
        testCaseNumber: i + 1,
        passed: false,
        executionTime,
        isHidden: tc.isHidden || false,
        error: true,
        errorMessage: error.message,
        ...(!tc.isHidden && {
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: '',
        }),
      });
    }
  }

  return {
    results,
    summary: {
      total: testCases.length,
      passed: totalPassed,
      failed: testCases.length - totalPassed,
      totalExecutionTime,
    },
  };
};

module.exports = {
  runCode,
  runCodeWithTestCases,
  languageMap,
};
