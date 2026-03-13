import { formatCliCommand } from "../cli/command-format.js";
import type { PairingChannel } from "./pairing-store.js";

export function buildPairingReply(params: {
  channel: PairingChannel;
  idLine: string;
  code: string;
}): string {
  const { channel, idLine, code } = params;
  const appName = process.env.TRAVERSALAI_APP === "1" ? "TraversalAI" : "TraversalAI";
  return [
    `${appName}: access not configured.`,
    "",
    idLine,
    "",
    `Pairing code: ${code}`,
    "",
    "Ask the bot owner to approve with:",
    formatCliCommand(`traversalai pairing approve ${channel} ${code}`),
  ].join("\n");
}
