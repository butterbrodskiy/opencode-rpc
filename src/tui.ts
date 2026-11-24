import { Plugin } from "@opencode/plugin/tui";
import { PresenceRpc } from "./rpc.js";

export const tuiPluginId = "opencode-rpc-tui";

const HEARTBEAT_INTERVAL_MS = 5000;

export function createTuiPlugin() {
  return Plugin.define({
    id: tuiPluginId,
    setup(context) {
      const rpc = context.client.rpc(PresenceRpc);

      function sendHeartbeat() {
        void rpc.heartbeat({}).catch(() => {});
      }

      sendHeartbeat();
      const timer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

      return () => {
        clearInterval(timer);
      };
    },
  });
}

export default createTuiPlugin();
