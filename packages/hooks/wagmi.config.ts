import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      deployments: {
        // BitConnect DAO on Goerli
        DAO: { 5: "0xce780fea1c950a29769b4f10817a9c51154d12af" },
        Budget: { 5: "0xfea7C89Ae8168f0f0FB9bA053b79C02819eC8C91" },
        TokenVoting: { 5: "0xc41e25d5e7cf5457b635d94c2262f914bb9d36e8" },
        // Protocol Contracts
        PluginRepo: { 5: "0x9b72Af17B8aE55AE2F3C06E46A44D9bEaFb10801" },
        PluginSetupProcessor: {
          5: "0xE8B5d8D66a02CD1b9Bd32a4064D7ABa45F51305e",
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
