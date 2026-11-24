import { Rpc } from "@opencode/plugin/rpc";

export const PresenceRpc = Rpc.define({
  id: "opencode-rpc",
  methods: {
    heartbeat: {
      input: {
        type: "object",
        additionalProperties: true,
      },
      output: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
        },
        required: ["ok"],
        additionalProperties: false,
      },
    },
  },
  events: {},
});
