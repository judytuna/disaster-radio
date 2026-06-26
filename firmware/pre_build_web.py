Import("env")
import subprocess
import sys
import os

_FIRMWARE_DIR = os.path.dirname(os.path.abspath(env.GetProjectConfig().path))
_WEB_DIR = os.path.join(os.path.dirname(_FIRMWARE_DIR), "web")

def build_web(source, target, env):
    web_dir = _WEB_DIR

    # Source nvm and run npm install + build. Uses a login shell so nvm is available.
    cmd = (
        'export NVM_DIR="${NVM_DIR:-$HOME/.nvm}" && '
        '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && '
        f'cd "{web_dir}" && '
        'nvm use && '
        'npm install && '
        'npm run build'
    )

    print(">>> Building web app...")
    result = subprocess.run(["bash", "-lc", cmd], check=False)
    if result.returncode != 0:
        print("ERROR: Web app build failed. Filesystem upload aborted.", file=sys.stderr)
        env.Exit(1)
    print(">>> Web app build complete.")

env.AddPreAction("$BUILD_DIR/spiffs.bin", build_web)
env.AddPreAction("$BUILD_DIR/littlefs.bin", build_web)
