# opencode-discord-rpc

Discord Rich Presence for [OpenCode](https://opencode.ai).

<p align="center">
  <img width="458" height="163" src="https://github.com/user-attachments/assets/222a7434-38b3-44ca-9292-abde7b7863c5" />
</p>

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

it should be added automatically to your opencode.json, but in case if it isn't:

```json
{
  "plugin": ["opencode-discord-rpc"]
}
```

## configuration

```json
{
  "plugin": ["opencode-discord-rpc"],
  "plugin_config": {
    "opencode-discord-rpc": {
      "clientId": "1234567..." # in case if you want your own discord application client id. by default - uses my client id :)
      "showProject": true # set to "false" if you want to hide the project you're working on
      "showTokens": true # set to "false" if you want to hide input/output token stats
      "showCost": true # set to "false" if you want to hide money spent stats
      "customText": "deep into vibecoding in" # add your own text instead of "Working on"
      "hideProjectText": "your mom" # add your own text instead of your project's name
      "providerIcons": { # if you want to add your own icons instead of provided ones; or if you have custom added providers
        "openai": "https://example.com/my-icon.png",
        "user-added-provider": "https://example.com/my-icon-2.png"
      }
    }
  }
}
```

## built-in provider icons

these provider IDs are recognized out of the box and show their logo as the small icon in Discord:

| provider ID(s) | |
|---|---|
| `openai` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/openai.png" width="24" /> |
| `anthropic` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/anthropic.png" width="24" /> |
| `google`, `google-gemini`, `gemini`, `google-vertex` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png" width="24" /> |
| `groq` | <img src="https://www.google.com/s2/favicons?domain=groq.com&sz=32" width="24" /> |
| `together`, `together-color`, `togetherai` | <img src="https://www.google.com/s2/favicons?domain=together.ai&sz=32" width="24" /> |
| `cohere` | <img src="https://www.google.com/s2/favicons?domain=cohere.com&sz=32" width="24" /> |
| `mistral` | <img src="https://www.google.com/s2/favicons?domain=mistral.ai&sz=32" width="24" /> |
| `azure` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/azure.png" width="24" /> |
| `aws`, `amazon`, `amazon-bedrock` | <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/amazon-web-services.png" width="24" /> |
| `xai` | <img src="https://www.google.com/s2/favicons?domain=x.ai&sz=32" width="24" /> |
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
| `opencode-go`, `opencode-zen` | uses the OpenCode app icon |

any unrecognized provider falls back to the OpenCode icon unless specified in providerIcons.

## uhhh

everything was vibecoded with opencode go's kimi k2.6 :) but if it works it works
