import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ports = [3000, 3001, 5000, 8000];
const nextDevMarker = `${root}/node_modules/.bin/next dev`;

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function killPid(pid, reason) {
  try {
    process.kill(Number(pid), "SIGTERM");
    console.log(`[SmartFin AI] Killed PID ${pid} (${reason})`);
    return true;
  } catch {
    return false;
  }
}

let killed = 0;

// Kill this project's `next dev` process tree.
if (run(`pgrep -f "${nextDevMarker.replace(/"/g, '\\"')}"`)) {
  run(`pkill -f "${nextDevMarker.replace(/"/g, '\\"')}"`);
  console.log("[SmartFin AI] Stopped existing next dev process");
  killed += 1;
}

for (const port of ports) {
  const pids = run(`lsof -tiTCP:${port} -sTCP:LISTEN`).split("\n").filter(Boolean);

  for (const pid of pids) {
    const args = run(`ps -p ${pid} -o args=`);
    if (!args) continue;

    const isProjectProcess =
      args.includes(root) ||
      args.includes("next-server") ||
      args.includes("next dev") ||
      args.includes("turbopack");

    if (isProjectProcess && killPid(pid, `listening on port ${port}`)) {
      killed += 1;
    }
  }
}

if (killed === 0) {
  console.log("[SmartFin AI] No dev server processes found on ports 3000, 3001, 5000, 8000");
} else {
  console.log(`[SmartFin AI] Cleared ${killed} process(es). You can run npm run dev now.`);
}
