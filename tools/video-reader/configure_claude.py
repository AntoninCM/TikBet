"""Ajoute le serveur « video-reader » dans la config de Claude Desktop (avec sauvegarde)."""

import glob
import json
import os
import shutil
import sys
import time


def config_dirs():
    home = os.path.expanduser("~")
    if sys.platform == "darwin":
        return [os.path.join(home, "Library", "Application Support", "Claude")]
    if sys.platform == "win32":
        dirs = [os.path.join(os.environ["APPDATA"], "Claude")]
        # Version Microsoft Store de Claude Desktop
        local = os.environ.get("LOCALAPPDATA", "")
        dirs += glob.glob(os.path.join(local, "Packages", "*Claude*", "LocalCache", "Roaming", "Claude"))
        return dirs
    return [os.path.join(home, ".config", "Claude")]


def main(python_exe, server_py):
    dirs = config_dirs()
    existing = [d for d in dirs if os.path.isdir(d)] or dirs[:1]
    for d in existing:
        os.makedirs(d, exist_ok=True)
        path = os.path.join(d, "claude_desktop_config.json")
        config = {}
        if os.path.exists(path):
            shutil.copy(path, f"{path}.backup-{time.strftime('%Y%m%d-%H%M%S')}")
            with open(path, encoding="utf-8") as f:
                content = f.read().strip()
            config = json.loads(content) if content else {}
        config.setdefault("mcpServers", {})["video-reader"] = {
            "command": python_exe,
            "args": [server_py],
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        print(f"   Config mise à jour : {path}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
