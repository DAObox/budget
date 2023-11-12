"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import {
  DynamicContextProvider,
  DynamicWagmiConnector,
  EthereumWalletConnectors,
} from "@/components/dynamic";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);
  const router = useRouter();

  if (!isClient) return null;

  return (
    <NextUIProvider navigate={router.push}>
      <DynamicContextProvider
        settings={{
          environmentId: "59a4be2e-bd62-418c-ba01-a0ded05d8598",
          walletConnectors: [EthereumWalletConnectors],
          eventsCallbacks: {
            onAuthSuccess: (args) => {
              console.log({ loggedIn: args });
              router.push("/main");
            },
            onLogout: (args) => {
              console.log({ logout: args });
              router.push("/");
            },
          },
        }}
      >
        <DynamicWagmiConnector>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </NextUIProvider>
  );
}
