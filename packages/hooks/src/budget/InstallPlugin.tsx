import { useInstallBudget, useStore } from "../hooks";
import { ProcessingMessage } from "../components/ProcessingMessage";

export function InstallPlugin() {
  const { daoAddress, tokenVotingAddress } = useStore();
  const { installPlugin, prepareTxHash, prepareTxReceipt, installTxReceipt, installTxHash, error, isLoading } =
    useInstallBudget();
  console.log({
    installPlugin,
    prepareTxHash,
    prepareTxReceipt,
    installTxReceipt,
    installTxHash,
    error,
    isLoading,
  });

  let buttonText;
  switch (true) {
    case isLoading && !prepareTxHash && !installTxHash:
      buttonText = "Waiting for Signer...";
      break;
    case isLoading && !!prepareTxHash && !prepareTxReceipt:
      buttonText = "Waiting for preparation confirmation...";
      break;
    case isLoading && !!prepareTxReceipt && !installTxHash:
      buttonText = "Waiting for Signer...";
      break;
    case isLoading && !!installTxHash && !installTxReceipt:
      buttonText = "Waiting for install confirmation...";
      break;
    case !!installTxReceipt:
      buttonText = "Budgets Installed";
      break;
    case !!error:
      buttonText = "Error";
      break;
    default:
      buttonText = "Install Plugin";
  }

  return (
    <div>
      <h2>Install Budget</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button
          onClick={() => installPlugin?.()}
          disabled={isLoading || !!installTxReceipt || !daoAddress || !tokenVotingAddress}
        >
          {buttonText}
        </button>
        {prepareTxHash && <ProcessingMessage hash={prepareTxHash?.hash} name="Prepare Install" />}
        {installTxHash && <ProcessingMessage hash={installTxHash?.hash} name="Install Plugin" />}
        {error && <div>Error: {error.message}</div>}
      </div>
    </div>
  );
}
