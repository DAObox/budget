import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

import { InstallPlugin } from "./budget/InstallPlugin";
import { NewRootBudget } from "./budget/CreateRootBudget";
import { BudgetInfo } from "./budget/BudgetInfo";
import { BudgetSelector } from "./budget/BudgetSelector";
import { DaoDetails } from "./budget/DaoDetails";
import { useStore } from "./hooks";

export function App() {
  const { isConnected } = useAccount();
  const { hasDao, hasBudget } = useStore();

  return (
    <>
      <h1>Budgets Hooks</h1>
      USDC: 0x7e356025b80B220661c859d134ae12146f73f335
      <p>(DAO): 0x5bb4f8d77a072cdcfdb5e47da248c579e70be597</p>
      <ConnectKitButton />
      <DaoDetails />
      <hr />
      {isConnected && hasDao && (
        <>
          {!hasBudget ? (
            <>
              <h3>no budget found for this DAO</h3>
              <hr />
              <InstallPlugin />
              <hr />
            </>
          ) : (
            <>
              <BudgetSelector />
              <hr />
              <BudgetInfo />
              <hr />
              <NewRootBudget />
              <hr />
            </>
          )}
        </>
      )}
    </>
  );
}
