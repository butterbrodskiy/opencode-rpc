import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

const PLUGIN_NAME = "opencode-discord-rpc";

if (process.env.SKIP_OPENCODE_AUTO_CONFIG) {
  process.exit(0);
}

function findOpenCodeConfig() {
  const cwd = process.cwd();

  // walk up from cwd looking for opencode.json / opencode.jsonc
  let dir = cwd;
  while (true) {
    for (const name of ["opencode.json", "opencode.jsonc"]) {
      const p = join(dir, name);
      if (existsSync(p)) return p;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  // check the global config
  for (const name of ["opencode.json", "opencode.jsonc"]) {
    const p = join(homedir(), ".config", "opencode", name);
    if (existsSync(p)) return p;
  }

  // no config found — create one in cwd
  return join(cwd, "opencode.json");
}

function stripJsonComments(text) {
  return text
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/,(?=\s*[}\]])/g, "");
}

const configPath = findOpenCodeConfig();
let config = {};

if (existsSync(configPath)) {
  try {
    const raw = readFileSync(configPath, "utf-8");
    config = JSON.parse(stripJsonComments(raw));
  } catch {
    console.warn(`[opencode-discord-rpc] could not parse ${configPath}, skipping auto-config`);
    process.exit(0);
  }
}

const plugins = Array.isArray(config.plugin) ? config.plugin : [];

const alreadyAdded = plugins.some((p) => {
  if (typeof p === "string") return p === PLUGIN_NAME;
  if (Array.isArray(p) && p.length > 0) return p[0] === PLUGIN_NAME;
  return false;
});

if (alreadyAdded) {
  console.log(`[opencode-discord-rpc] already in ${configPath}, nothing to do`);
  process.exit(0);
}

config.plugin = [...plugins, PLUGIN_NAME];

writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
console.log(`[opencode-discord-rpc] added to ${configPath}`);
