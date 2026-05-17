# opencode-discord-rpc

Discord Rich Presence for [OpenCode](https://opencode.ai) — shows what you're working on, which model is active, and your token usage directly on your Discord profile.

<p align="center">
  <img src="https://opencode.ai/_build/assets/opencode-desktop-icon-OSkS5hfD.png" width="128" alt="OpenCode" />
</p>

## what it shows

- **line 1** — `Working on project-name` (customizable prefix, or `At the main screen...` when idle)
- **line 2** — `↓ 12.3k | ↑ 4.5k / $0.17` (input tokens ↓, output tokens ↑, total cost)
- **small icon** — provider logo (openai, anthropic, groq, etc.)
- **small text** — `provider/model-id`
- **elapsed time** — since you launched OpenCode

## install

```bash
bun add opencode-discord-rpc
```

or

```bash
npm install opencode-discord-rpc
```

or

```bash
pnpm add opencode-discord-rpc
```

## setup

Add it to your `opencode.json`:

```json
{
  "plugin": ["opencode-discord-rpc"]
}
```

that's it — Discord must be running on the same machine. the plugin uses a pre-configured Discord application so you don't need to create your own.

## configuration

pass options as the second element of the plugin tuple, or via `plugin_config`:

```json
{
  "plugin": [
    ["opencode-discord-rpc", {
      "customText": "Vibecoding in",
      "showCost": false
    }]
  ]
}
```

or using `plugin_config` (useful when you want to share options across configs):

```json
{
  "plugin": ["opencode-discord-rpc"],
  "plugin_config": {
    "opencode-discord-rpc": {
      "customText": "Vibecoding in"
    }
  }
}
```

### options

| option | type | default | description |
|---|---|---|---|
| `clientId` | `string` | `"1505556269036077178"` | your own Discord application client ID |
| `showProject` | `boolean` | `true` | show project folder name in status |
| `showTokens` | `boolean` | `true` | show `↓ input | ↑ output` token counts |
| `showCost` | `boolean` | `true` | show estimated cost in USD |
| `customText` | `string` | `"Working on"` | prefix before the project name |
| `hideProjectText` | `string` | `"something..."` | fallback text when `showProject` is false |
| `providerIcons` | `object` | built-in map | override or add provider icon URLs |

### custom provider icons

```json
{
  "plugin": [
    ["opencode-discord-rpc", {
      "providerIcons": {
        "my-custom-provider": "https://example.com/icon.png",
        "openai": "https://example.com/custom-openai.png"
      }
    }]
  ]
}
```

keys are merged with the built-in defaults — your values take priority.

## built-in provider icons

these provider IDs are recognized out of the box and show their logo as the small icon in Discord:

| provider ID(s) | |
|---|---|
| `openai` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/openai.png" width="24" /> |
| `anthropic` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/anthropic.png" width="24" /> |
| `google`, `google-gemini`, `gemini`, `google-vertex` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png" width="24" /> |
| `groq` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/groq.png" width="24" /> |
| `together`, `together-color`, `togetherai` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/together-color.png" width="24" /> |
| `cohere` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/cohere.png" width="24" /> |
| `mistral` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/mistral.png" width="24" /> |
| `azure` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/azure.png" width="24" /> |
| `aws`, `amazon`, `amazon-bedrock` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/amazon-web-services.png" width="24" /> |
| `xai` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/xai.png" width="24" /> |
| `deepseek` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/deepseek.png" width="24" /> |
| `perplexity` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/perplexity.png" width="24" /> |
| `copilot`, `github-copilot`, `github` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/github-copilot.png" width="24" /> |
| `gitlab` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/gitlab.png" width="24" /> |
| `huggingface` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/hugging-face.png" width="24" /> |
| `cloudflare`, `cloudflare-ai-gateway`, `cloudflare-workers-ai` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/cloudflare.png" width="24" /> |
| `nvidia` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/nvidia.png" width="24" /> |
| `databricks` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/databricks.png" width="24" /> |
| `vercel` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/vercel.png" width="24" /> |
| `vultr` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/vultr.png" width="24" /> |
| `zenmux` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/zenmux.png" width="24" /> |
| `ovhcloud` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/ovh.png" width="24" /> |
| `ollama` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/ollama.png" width="24" /> |
| `opencode` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/opencode.png" width="24" /> |
| `opencode-go`, `opencode-zen` | uses the OpenCode app icon |

any unrecognized provider falls back to the OpenCode icon.

## examples

**default — everything on:**

```json
{ "plugin": ["opencode-discord-rpc"] }
```

Discord shows: `Working on my-project` / `↓ 85.2k | ↑ 12.1k / $0.42`

**hide project name:**

```json
{ "plugin": [["opencode-discord-rpc", { "showProject": false }]] }
```

Discord shows: `Working on something...` / `↓ 85.2k | ↑ 12.1k / $0.42`

**custom prefix, hide cost:**

```json
{ "plugin": [["opencode-discord-rpc", { "customText": "Coding in", "showCost": false }]] }
```

Discord shows: `Coding in my-project` / `↓ 85.2k | ↑ 12.1k`

**minimal — only project name, no stats:**

```json
{ "plugin": [["opencode-discord-rpc", { "showTokens": false, "showCost": false }]] }
```

Discord shows: `Working on my-project`

## how token display works

the plugin listens to `message.updated` events from OpenCode and accumulates tokens per session. each assistant message contributes its `input`, `output`, and `reasoning` tokens:

- **↓ input** = `tokens.input`
- **↑ output** = `tokens.output + tokens.reasoning`
- **cost** = sum of all `message.cost`

messages are deduplicated by ID — if a message is streamed and updated multiple times, only the latest totals are kept. the presence refreshes with a 3-second debounce.

## requirements

- [OpenCode](https://opencode.ai) (any recent version)
- Discord desktop client running on the same machine
- Node.js, Bun, or Deno runtime

## license

MIT
