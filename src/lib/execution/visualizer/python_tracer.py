import sys
import json
import copy

MAX_STEPS = 500
MAX_STR_LEN = 200

trace_data = []
call_stack = []
step_count = 0

def safe_repr(val, depth=0):
    """Safely represent a value for JSON serialization."""
    if depth > 3:
        return "..."
    if val is None:
        return None
    if isinstance(val, (int, float, bool)):
        return val
    if isinstance(val, str):
        return val[:MAX_STR_LEN] + ("..." if len(val) > MAX_STR_LEN else "")
    if isinstance(val, list):
        return [safe_repr(v, depth + 1) for v in val[:50]]
    if isinstance(val, tuple):
        return [safe_repr(v, depth + 1) for v in val[:50]]
    if isinstance(val, dict):
        return {str(k)[:50]: safe_repr(v, depth + 1) for k, v in list(val.items())[:20]}
    if isinstance(val, set):
        return [safe_repr(v, depth + 1) for v in list(val)[:50]]
    return str(val)[:MAX_STR_LEN]

def get_variables(frame):
    """Extract local variables from a frame, filtering out internal ones."""
    variables = {}
    for name, value in frame.f_locals.items():
        if name.startswith('_') or name in ('__builtins__', '__name__', '__doc__', '__package__', '__loader__', '__spec__'):
            continue
        try:
            variables[name] = {
                "value": safe_repr(value),
                "type": type(value).__name__
            }
        except Exception:
            variables[name] = {"value": "<error>", "type": "unknown"}
    return variables

def tracer(frame, event, arg):
    global step_count
    
    # Only trace user code (the file we're running)
    filename = frame.f_code.co_filename
    if filename != "solution.py":
        return tracer
    
    if step_count >= MAX_STEPS:
        return None
    
    if event == "line":
        step_count += 1
        variables = get_variables(frame)
        trace_data.append({
            "step": step_count,
            "line": frame.f_lineno,
            "event": "line",
            "function": frame.f_code.co_name,
            "variables": variables,
            "callStack": list(call_stack),
            "stdout": ""
        })
    elif event == "call":
        func_name = frame.f_code.co_name
        if func_name != "<module>":
            call_stack.append(func_name)
            step_count += 1
            trace_data.append({
                "step": step_count,
                "line": frame.f_lineno,
                "event": "call",
                "function": func_name,
                "variables": get_variables(frame),
                "callStack": list(call_stack),
                "stdout": ""
            })
    elif event == "return":
        func_name = frame.f_code.co_name
        if func_name != "<module>":
            step_count += 1
            trace_data.append({
                "step": step_count,
                "line": frame.f_lineno,
                "event": "return",
                "function": func_name,
                "returnValue": safe_repr(arg),
                "variables": get_variables(frame),
                "callStack": list(call_stack),
                "stdout": ""
            })
            if call_stack and call_stack[-1] == func_name:
                call_stack.pop()
    elif event == "exception":
        step_count += 1
        trace_data.append({
            "step": step_count,
            "line": frame.f_lineno,
            "event": "exception",
            "function": frame.f_code.co_name,
            "variables": get_variables(frame),
            "callStack": list(call_stack),
            "error": str(arg[1]) if arg else "Unknown error",
            "stdout": ""
        })
    
    return tracer

# Capture stdout
class StdoutCapture:
    def __init__(self):
        self.captured = []
        self.current = ""
    
    def write(self, text):
        self.current += text
        self.captured.append(text)
        # Tag the last trace step with stdout
        if trace_data:
            trace_data[-1]["stdout"] = self.current
    
    def flush(self):
        pass

# Read user code
with open("solution.py", "r") as f:
    user_code = f.read()

# Read stdin if available
stdin_data = ""
try:
    with open("input.txt", "r") as f:
        stdin_data = f.read()
except FileNotFoundError:
    pass

# Redirect stdin
import io
sys.stdin = io.StringIO(stdin_data)

# Capture stdout
capture = StdoutCapture()
sys.stdout = capture

# Run with tracer
error_info = None
try:
    compiled = compile(user_code, "solution.py", "exec")
    sys.settrace(tracer)
    exec(compiled, {"__name__": "__main__", "__builtins__": __builtins__})
    sys.settrace(None)
except Exception as e:
    sys.settrace(None)
    error_info = {"type": type(e).__name__, "message": str(e)}

# Restore stdout
sys.stdout = sys.__stdout__

# Output the trace as JSON
result = {
    "steps": trace_data,
    "totalSteps": len(trace_data),
    "code": user_code,
    "error": error_info,
    "finalOutput": "".join(capture.captured)
}

print(json.dumps(result))
