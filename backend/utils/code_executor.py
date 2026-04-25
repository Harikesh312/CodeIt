import subprocess
import tempfile

def run_code(language, code):
    try:
        if language == "python":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as f:
                f.write(code.encode())
                filename = f.name

            result = subprocess.run(
                ["python", filename],
                capture_output=True,
                text=True,
                timeout=2
            )
            return result.stdout or result.stderr

        elif language == "javascript":
            result = subprocess.run(
                ["node", "-e", code],
                capture_output=True,
                text=True,
                timeout=2
            )
            return result.stdout or result.stderr

    except subprocess.TimeoutExpired:
        return "Execution timed out"