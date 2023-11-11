import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import { budgetRepoAddress, pluginSetupProcessorAddress } from "./src/lib/constants";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      deployments: {
        PluginRepo: budgetRepoAddress,
        PluginSetupProcessor: pluginSetupProcessorAddress,
      },
      project: "../contracts",
    }),
    react(),
  ],
});
