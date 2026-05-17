import { Client } from "@xhayper/discord-rpc";
import type { Plugin, Config } from "@opencode-ai/plugin";
import type { Event, AssistantMessage, Session } from "@opencode-ai/sdk";

interface DiscordRPOptions {
  clientId?: string;
  showProject?: boolean;
  showTokens?: boolean;
  showCost?: boolean;
  customText?: string;
  hideProjectText?: string;
  providerIcons?: Record<string, string>;
}

const CDN = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png";
const OPENCODE_LOGO = "https://opencode.ai/_build/assets/opencode-desktop-icon-OSkS5hfD.png";

const DEFAULT_PROVIDER_ICONS: Record<string, string> = {
  openai: `${CDN}/openai.png`,
  anthropic: `${CDN}/anthropic.png`,
  google: `${CDN}/google-gemini.png`,
  "google-gemini": `${CDN}/google-gemini.png`,
  gemini: `${CDN}/google-gemini.png`,
  "google-vertex": `${CDN}/google-gemini.png`,
  groq: "https://www.google.com/s2/favicons?domain=groq.com&sz=256",
  together: "https://www.google.com/s2/favicons?domain=together.ai&sz=256",
  "together-color": "https://www.google.com/s2/favicons?domain=together.ai&sz=256",
  togetherai: "https://www.google.com/s2/favicons?domain=together.ai&sz=256",
  cohere: "https://www.google.com/s2/favicons?domain=cohere.com&sz=256",
  mistral: "https://www.google.com/s2/favicons?domain=mistral.ai&sz=256",
  azure: `${CDN}/azure.png`,
  aws: `${CDN}/amazon-web-services.png`,
  amazon: `${CDN}/amazon-web-services.png`,
  "amazon-bedrock": `${CDN}/amazon-web-services.png`,
  xai: "https://www.google.com/s2/favicons?domain=x.ai&sz=256",
  deepseek: `${CDN}/deepseek.png`,
  perplexity: `${CDN}/perplexity.png`,
  copilot: `${CDN}/github-copilot.png`,
  "github-copilot": `${CDN}/github-copilot.png`,
  github: `${CDN}/github-copilot.png`,
  gitlab: `${CDN}/gitlab.png`,
  huggingface: `${CDN}/hugging-face.png`,
  cloudflare: `${CDN}/cloudflare.png`,
  "cloudflare-ai-gateway": `${CDN}/cloudflare.png`,
  "cloudflare-workers-ai": `${CDN}/cloudflare.png`,
  nvidia: `${CDN}/nvidia.png`,
  databricks: `${CDN}/databricks.png`,
  vercel: `${CDN}/vercel.png`,
  vultr: `${CDN}/vultr.png`,
  zenmux: `${CDN}/zenmux.png`,
  ovhcloud: `${CDN}/ovh.png`,
  ollama: `${CDN}/ollama.png`,
  opencode: `${CDN}/opencode.png`,
  "opencode-go": OPENCODE_LOGO,
  "opencode-zen": OPENCODE_LOGO,
};

const GENERIC_ICON = `${CDN}/opencode.png`;

function getProjectName(directory: string, showProject: boolean, hideText: string): string {
  if (showProject === false) {
    return hideText;
  }
  const parts = directory.split(/[\\/]/).filter(p => p.length > 0);
  return parts[parts.length - 1] || "";
}

function formatTokens(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(2) + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  }
  return count.toString();
}

const discordRPPlugin: Plugin = async (input, rawOptions) => {
  const tupleOptions = (rawOptions || {}) as unknown as DiscordRPOptions;
  let options: DiscordRPOptions = { ...tupleOptions };

  const providerIcons = { ...DEFAULT_PROVIDER_ICONS, ...options.providerIcons };

  const sessions = new Set<string>();
  const messages: Array<{ id: string; sessionID: string; tokensInput: number; tokensOutput: number; cost: number }> = [];
  const seenMessages = new Set<string>();
  let currentSessionID: string | null = null;
  let currentModel: { providerID: string; modelID: string } | null = null;
  let currentProjectDir: string | null = null;
  let updateTimer: ReturnType<typeof setTimeout> | null = null;
  const pluginStartTime = Date.now();
  let client: Client | null = null;
  let discordReady = false;

  function getSessionTotals(sessionID: string) {
    let tokensInput = 0;
    let tokensOutput = 0;
    let cost = 0;
    for (const msg of messages) {
      if (msg.sessionID === sessionID) {
        tokensInput += msg.tokensInput;
        tokensOutput += msg.tokensOutput;
        cost += msg.cost;
      }
    }
    return { tokensInput, tokensOutput, cost };
  }

  function buildDetails(): string {
    if (!currentSessionID) {
      return "At the main screen...";
    }

    const projectDir = currentProjectDir || input.worktree || input.directory || "";
    const showProject = options.showProject !== false;
    const hideText = options.hideProjectText || "";
    const projectName = getProjectName(projectDir, showProject, hideText);
    const prefix = options.customText || "Working on";

    if (showProject) {
      return `${prefix} ${projectName || ""}`.trim();
    }

    return `${prefix} ${hideText || ""}`.trim();
  }

  function buildState(): string | undefined {
    if (!currentSessionID) return undefined;

    const showTokens = options.showTokens !== false;
    const showCost = options.showCost !== false;
    const { tokensInput, tokensOutput, cost } = getSessionTotals(currentSessionID);

    const parts: string[] = [];
    if (showTokens) {
      const tokenParts: string[] = [];
      if (tokensInput > 0) tokenParts.push(`\u2193 ${formatTokens(tokensInput)}`);
      if (tokensOutput > 0) tokenParts.push(`\u2191 ${formatTokens(tokensOutput)}`);
      if (tokenParts.length > 0) {
        parts.push(tokenParts.join(" | "));
      }
    }
    if (showCost && cost > 0) {
      parts.push(`$${cost.toFixed(2)}`);
    }
    return parts.length > 0 ? parts.join(" / ") : undefined;
  }

  function updatePresence() {
    if (!client || !client.isConnected) return;

    const smallImage = currentModel ? providerIcons[currentModel.providerID] || GENERIC_ICON : undefined;
    const smallText = currentModel ? `${currentModel.providerID}/${currentModel.modelID}` : undefined;

    client.user?.setActivity({
      details: buildDetails(),
      state: buildState(),
      startTimestamp: pluginStartTime,
      largeImageKey: OPENCODE_LOGO,
      largeImageText: "OpenCode",
      smallImageKey: smallImage,
      smallImageText: smallText,
    })?.catch(() => {});
  }

  function queueUpdate() {
    if (updateTimer) return;
    updateTimer = setTimeout(() => {
      updateTimer = null;
      updatePresence();
    }, 3000);
  }

  function initDiscord() {
    if (client || discordReady) return;
    try {
      const clientId = options.clientId || "1505556269036077178";
      client = new Client({ clientId });
      client.on("ready", () => {
        discordReady = true;
        updatePresence();
      });
      client.login().catch(() => {});
    } catch {
      // discord not available
    }
  }

  function initSessions() {
    try {
      input.client.session.list({ query: { directory: input.directory } })
        .then((res: any) => {
          if (res.data && Array.isArray(res.data)) {
            for (const s of res.data) {
              if (s.id) sessions.add(s.id);
              if (s.directory && !currentProjectDir) currentProjectDir = s.directory;
            }
            if (!currentSessionID && sessions.size > 0) {
              currentSessionID = Array.from(sessions)[sessions.size - 1];
              queueUpdate();
            }
          }
        })
        .catch(() => {});
    } catch {
      // ignore
    }
  }

  return {
    config: async (cfg: Config) => {
      const pluginConfig = (cfg as any).plugin_config?.["opencode-discord-rpc"];
      if (pluginConfig) {
        options = { ...options, ...pluginConfig };
      }

      setTimeout(() => {
        initDiscord();
        initSessions();
      }, 100);
    },

    event: async ({ event }: { event: Event }) => {
      if (!client) initDiscord();

      if (event.type === "session.created") {
        const info = (event as any).properties.info as Session;
        sessions.add(info.id);
        currentSessionID = info.id;
        if (info.directory) currentProjectDir = info.directory;
        queueUpdate();
      }

      if (event.type === "session.deleted") {
        const info = (event as any).properties.info as Session;
        sessions.delete(info.id);
        if (currentSessionID === info.id) {
          currentSessionID = sessions.size > 0 ? Array.from(sessions)[sessions.size - 1] : null;
        }
        queueUpdate();
      }

      if (event.type === "message.updated") {
        const msg = (event as any).properties.info;

        if (msg.role === "user") {
          currentSessionID = msg.sessionID;
          currentModel = msg.model;
          queueUpdate();
        } else if (msg.role === "assistant") {
          const assistant = msg as AssistantMessage;
          currentSessionID = assistant.sessionID;
          currentModel = { providerID: assistant.providerID, modelID: assistant.modelID };
          if (assistant.path?.cwd) currentProjectDir = assistant.path.cwd;

          const tokensInput = assistant.tokens.input;
          const tokensOutput = assistant.tokens.output + assistant.tokens.reasoning;

          if (!seenMessages.has(assistant.id)) {
            seenMessages.add(assistant.id);
            messages.push({
              id: assistant.id,
              sessionID: assistant.sessionID,
              tokensInput,
              tokensOutput,
              cost: assistant.cost,
            });
          } else {
            const existing = messages.find(m => m.id === assistant.id);
            if (existing) {
              existing.tokensInput = tokensInput;
              existing.tokensOutput = tokensOutput;
              existing.cost = assistant.cost;
            }
          }
          queueUpdate();
        }
      }
    },
  };
};

export default discordRPPlugin;
