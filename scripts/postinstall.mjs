import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

const PLUGIN_NAME = "opencode-discord-rpc";

if (process.env.SKIP_OPENCODE_AUTO_CONFIG) {
  process.exit(0);
}

function findOpenCodeConfig() {
  const cwd = process.cwd();
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
  for (const name of ["opencode.json", "opencode.jsonc"]) {
    const p = join(homedir(), ".config", "opencode", name);
    if (existsSync(p)) return p;
  }
  return join(cwd, "opencode.json");
}

const configPath = findOpenCodeConfig();

if (existsSync(configPath)) {
  const raw = readFileSync(configPath, "utf-8");

  // check if plugin is already referenced in the file (text-based, no parsing)
  if (raw.includes(`"${PLUGIN_NAME}"`)) {
    console.log(`[opencode-discord-rpc] already in ${configPath}, nothing to do`);
    process.exit(0);
  }

  // find the "plugin" array and insert our entry
  const pluginMatch = raw.match(/"plugin"\s*:\s*\[/);
  if (pluginMatch) {
    const insertAt = pluginMatch.index + pluginMatch[0].length;
    const before = raw.slice(0, insertAt);
    const after = raw.slice(insertAt);

    // determine indentation by looking at what follows the opening bracket
    const rest = after.trimStart();
    const indent = after.length - after.trimStart().length > 0
      ? after.slice(0, after.length - after.trimStart().length)
      : "    ";

    const entry = rest.startsWith("]") || rest.startsWith("\n") && rest.trimStart().startsWith("]")
      ? `\n${indent}"${PLUGIN_NAME}"\n${indent.slice(0, -2)}`
      : `"${PLUGIN_NAME}", `;

    writeFileSync(configPath, before + entry + after, "utf-8");
    console.log(`[opencode-discord-rpc] added to ${configPath}`);
  } else {
    // no plugin array found, append one at the end of the JSON object
    const trimmed = raw.trimEnd();
    const needsComma = !trimmed.endsWith("{") && !trimmed.endsWith(",");
    const insertion = `${needsComma ? "," : ""}\n  "plugin": ["${PLUGIN_NAME}"]\n}`;

    // replace the closing brace
    const lastBrace = trimmed.lastIndexOf("}");
    if (lastBrace >= 0) {
      const result = trimmed.slice(0, lastBrace) + insertion;
      writeFileSync(configPath, result + "\n", "utf-8");
    } else {
      writeFileSync(configPath, `{\n  "plugin": ["${PLUGIN_NAME}"]\n}\n`, "utf-8");
    }
    console.log(`[opencode-discord-rpc] added to ${configPath}`);
  }
} else {
  // no config exists, create one
  writeFileSync(configPath, `{\n  "plugin": ["${PLUGIN_NAME}"]\n}\n`, "utf-8");
  console.log(`[opencode-discord-rpc] created ${configPath}`);
}
