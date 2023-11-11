import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { App } from "./App";
import { config } from "./wagmi";
const queryClient = new QueryClient();

import { GlobalStateProvider } from "./hooks/useStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ConnectKitProvider debugMode>
        <QueryClientProvider client={queryClient}>
          <GlobalStateProvider>
            <App />
          </GlobalStateProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);
