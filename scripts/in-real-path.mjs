/*
 * Runs a command from the project folder's real on-disk casing.
 *
 * Windows opens a folder under any casing, but if the shell's path differs from the real one
 * (the folder was renamed "Agencia LGuia" -> "Agencia lguia"), the bundler resolves React through
 * two different paths and `next build` fails with "Cannot read properties of null (reading
 * 'useContext')". Usage: node scripts/in-real-path.mjs <command> [args...]
 */
import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error("Usage: node scripts/in-real-path.mjs <command> [args...]");
  process.exit(1);
}

const cwd = realpathSync.native(process.cwd());
const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: true });
process.exit(result.status ?? 1);
