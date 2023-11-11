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
      <h1>wagmi + Vite</h1>
      0x5bb4f8d77a072cdcfdb5e47da248c579e70be597
      <p>(new test): 0x970Fed12e8816aa4e5D57b9cCf66263DE8732a0d</p>
      <p>(no budget): 0x6f07aa7af27e0e06a08a1a17e04c4b0eb11300ab</p>
      <p>(with budget): 0xce780fea1c950a29769b4f10817a9c51154d12af</p>
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
