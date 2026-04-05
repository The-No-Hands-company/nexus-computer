import anthropic
import json
import os
import subprocess
from typing import AsyncGenerator

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

MODEL = os.environ.get("NEXUS_MODEL", "claude-sonnet-4-6")

SYSTEM_PROMPT = """You are Nexus — an intelligent personal cloud computer. You have full access to the user's personal cloud server workspace. You can execute bash commands, read and write files, install packages, run scripts, spin up servers, and help build anything.

Be direct and efficient. Show what you're doing as you do it. You have full shell access to the workspace."""

TOOLS = [
    {
        "name": "bash",
        "description": "Execute a bash command in the workspace. Use for running scripts, installing packages, creating/moving files, managing processes, etc.",
        "input_schema": {
            "type": "object",
            "properties": {
                "command": {
                    "type": "string",
                    "description": "Bash command to execute",
                }
            },
            "required": ["command"],
        },
    },
    {
        "name": "read_file",
        "description": "Read the contents of a file in the workspace",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "File path relative to workspace",
                }
            },
            "required": ["path"],
        },
    },
    {
        "name": "write_file",
        "description": "Write content to a file, creating directories as needed",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path relative to workspace"},
                "content": {"type": "string", "description": "Content to write"},
            },
            "required": ["path", "content"],
        },
    },
    {
        "name": "list_files",
        "description": "List files and directories at a path in the workspace",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Directory path relative to workspace (empty for root)",
                    "default": "",
                }
            },
        },
    },
]


def _execute_tool(name: str, inp: dict, workspace: str) -> str:
    if name == "bash":
        try:
            result = subprocess.run(
                inp["command"],
                shell=True,
                capture_output=True,
                text=True,
                timeout=60,
                cwd=workspace,
            )
            out = result.stdout
            if result.stderr:
                out += f"\n[stderr] {result.stderr}"
            if result.returncode != 0:
                out += f"\n[exit {result.returncode}]"
            return out.strip() or "(no output)"
        except subprocess.TimeoutExpired:
            return "[timeout] Command exceeded 60 seconds"
        except Exception as e:
            return f"[error] {e}"

    elif name == "read_file":
        try:
            p = os.path.join(workspace, inp["path"].lstrip("/"))
            with open(p) as f:
                return f.read()
        except Exception as e:
            return f"[error] {e}"

    elif name == "write_file":
        try:
            p = os.path.join(workspace, inp["path"].lstrip("/"))
            os.makedirs(os.path.dirname(p) or workspace, exist_ok=True)
            with open(p, "w") as f:
                f.write(inp["content"])
            return f"Written: {inp['path']}"
        except Exception as e:
            return f"[error] {e}"

    elif name == "list_files":
        try:
            p = os.path.join(workspace, inp.get("path", "").lstrip("/"))
            items = []
            for entry in os.scandir(p):
                items.append(
                    {
                        "name": entry.name,
                        "is_dir": entry.is_dir(),
                        "size": 0 if entry.is_dir() else entry.stat().st_size,
                    }
                )
            return json.dumps(
                sorted(items, key=lambda x: (not x["is_dir"], x["name"]))
            )
        except Exception as e:
            return f"[error] {e}"

    return f"[error] Unknown tool: {name}"


def _sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


async def run_agent_stream(messages: list, workspace: str):
    """Agentic loop with SSE streaming — handles multi-step tool use."""

    anthropic_messages = [{"role": m["role"], "content": m["content"]} for m in messages]

    while True:
        collected_text = ""
        stop_reason = None
        final_content = []

        with client.messages.stream(
            model=MODEL,
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=anthropic_messages,
        ) as stream:
            for event in stream:
                t = getattr(event, "type", None)
                if t == "content_block_delta":
                    delta = getattr(event, "delta", None)
                    if delta and hasattr(delta, "text"):
                        collected_text += delta.text
                        yield _sse({"type": "text", "content": delta.text})

            msg = stream.get_final_message()
            stop_reason = msg.stop_reason
            final_content = msg.content

        # Extract tool uses from the final message
        tool_uses = [b for b in final_content if b.type == "tool_use"]

        if stop_reason == "end_turn" or not tool_uses:
            yield _sse({"type": "done"})
            break

        if stop_reason == "tool_use":
            # Append full assistant turn to history
            assistant_blocks = []
            if collected_text:
                assistant_blocks.append({"type": "text", "text": collected_text})
            for tu in tool_uses:
                assistant_blocks.append(
                    {"type": "tool_use", "id": tu.id, "name": tu.name, "input": tu.input}
                )
            anthropic_messages.append({"role": "assistant", "content": assistant_blocks})

            # Execute each tool and collect results
            tool_results = []
            for tu in tool_uses:
                yield _sse({"type": "tool_use", "name": tu.name, "input": tu.input})

                result = _execute_tool(tu.name, tu.input, workspace)

                yield _sse({"type": "tool_result", "name": tu.name, "result": result[:1000]})

                tool_results.append(
                    {"type": "tool_result", "tool_use_id": tu.id, "content": result}
                )

            anthropic_messages.append({"role": "user", "content": tool_results})
            # Continue agentic loop
        else:
            yield _sse({"type": "done"})
            break
