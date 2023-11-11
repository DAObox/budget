import { useInstallBudget, useStore } from "../hooks";
import { ProcessingMessage } from "../components/ProcessingMessage";
import { InstallBudgetStatus } from "../hooks/useInstallBudget";

export function InstallPlugin() {
  const { daoAddress, tokenVotingAddress } = useStore();
  const { installPlugin, prepareTxHash, installTxHash, error, status } = useInstallBudget();

  const isDisabled = status !== InstallBudgetStatus.Idle || !daoAddress || !tokenVotingAddress;

  return (
    <div>
      <h2>Install Budget</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button onClick={() => installPlugin?.()} disabled={isDisabled}>
          {status}
        </button>
        {prepareTxHash && <ProcessingMessage hash={prepareTxHash?.hash} name="Prepare Install" />}
        {installTxHash && <ProcessingMessage hash={installTxHash?.hash} name="Install Plugin" />}
        {error && <div>Error: {error.message}</div>}
      </div>
    </div>
  );
}
