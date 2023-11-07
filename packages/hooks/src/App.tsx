import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { Account } from "./components/Account";

import { Counter } from "./components/Counter";
import { NetworkSwitcher } from "./components/NetworkSwitcher";

export function App() {
  const { isConnected } = useAccount();

  return (
    <>
      <h1>wagmi + Vite</h1>
      <ConnectKitButton />
      {isConnected && (
        <>
          <Account />
          <hr />
          <Counter />
          <hr />
          <NetworkSwitcher />
        </>
      )}
    </>
  );
}
