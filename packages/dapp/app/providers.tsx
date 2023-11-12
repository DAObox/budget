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
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <DynamicContextProvider
        settings={{
          // Find your environment id at https://app.dynamic.xyz/dashboard/developer
          environmentId: "59a4be2e-bd62-418c-ba01-a0ded05d8598",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <DynamicWagmiConnector>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </NextUIProvider>
  );
}
