import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";
import { foundry, polygonMumbai, goerli } from "wagmi/chains";

const walletConnectProjectId = "aa6a384ec72128564c94d1be7f81534d";

export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: "My wagmi + ConnectKit App",
    walletConnectProjectId,
    infuraId: import.meta.env.VITE_INFURA_API_KEY!,
    chains: [goerli, foundry],
  })
);
