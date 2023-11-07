import { useInstallBudget, useInstallProposal, usePrepareInstall } from "../hooks/useInstallBudget";
import { ProcessingMessage } from "./ProcessingMessage";

export function InstallPlugin() {
  const { installPlugin, prepareTxHash, prepareTxReceipt, installTxReceipt, installTxHash, error, isLoading } =
    useInstallBudget({
      daoAddress: "0xce780fea1c950a29769b4f10817a9c51154d12af",
      budgetRepoAddress: "0x9b72Af17B8aE55AE2F3C06E46A44D9bEaFb10801",
      pluginSetupProcessorAddress: "0xE8B5d8D66a02CD1b9Bd32a4064D7ABa45F51305e",
      tokenVotingAddress: "0xC41e25D5e7Cf5457b635D94c2262F914bb9d36E8",
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
      <h1>Budget</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button onClick={() => installPlugin?.()} disabled={isLoading || !!installTxReceipt}>
          {buttonText}
        </button>
        {prepareTxHash && <ProcessingMessage hash={prepareTxHash?.hash} name="Prepare Install" />}
        {installTxHash && <ProcessingMessage hash={installTxHash?.hash} name="Install Plugin" />}
        {error && <div>Error: {error.message}</div>}
      </div>
    </div>
  );
}
