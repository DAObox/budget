import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { Account } from "./components/Account";

import { InstallPlugin } from "./components/InstallPlugin";
import { NetworkSwitcher } from "./components/NetworkSwitcher";
import { NewRootBudget } from "./components/CreateRootBudget";

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
          <InstallPlugin />
          <hr />
          <NewRootBudget />
          <hr />
          <NetworkSwitcher />
        </>
      )}
    </>
  );
}
