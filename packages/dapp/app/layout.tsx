import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";

import clsx from "clsx";
import { BottomNav } from "@/components/bottom-nav";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // themeColor: [
  // 	{ media: "(prefers-color-scheme: light)", color: "white" },
  // 	{ media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {/* <Navbar /> */}
          {/* <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main> */}
          {/* <BottomNav /> */}
          <SplashScreen />
        </Providers>
      </body>
    </html>
  );
}

function SplashScreen() {
  return (
    <div className="relative flex flex-col h-screen bg-[#101010]">
      <div id="NewRootRoot" className="flex flex-col w-full">
        <div className="flex flex-col justify-between h-[812px] shrink-0 items-center pt-[321px] pb-8">
          <img
            src="https://file.rendit.io/n/jqavy1CcE0owESKvTO7a.svg"
            alt="Logo"
            id="Logo"
          />
          <div className="text-sm font-['Poppins'] font-medium text-white">
            Welcome to payup mobile app
          </div>
        </div>
      </div>
    </div>
  );
}
