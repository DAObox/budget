import { useInstallBudget, useInstallProposal, usePrepareInstall } from "../hooks/useInstallBudget";
import { useNewRootBudget } from "../hooks/useNewRootBudget";
import { TimeUnit } from "../types";
import { ProcessingMessage } from "./ProcessingMessage";

export function NewRootBudget() {
  const { error, isLoading, newRootBudget, txHash, txReceipt } = useNewRootBudget({
    spender: "0x47d80912400ef8f8224531EBEB1ce8f2ACf4b75a",
    token: "0x0D29312f4Ff79F1aC97c8c24A051D1b6443A3F91",
    amount: 42069000000000000000000n,
    recurrency: TimeUnit.Monthly,
    name: "Root Budget Test",
    budgetAddress: "0xfea7C89Ae8168f0f0FB9bA053b79C02819eC8C91",
    tokenVotingAddress: "0xc41e25d5e7cf5457b635d94c2262f914bb9d36e8",
  });

  let buttonText;
  switch (true) {
    case isLoading && !txHash:
      buttonText = "Waiting for Signer...";
      break;
    case isLoading && !!txHash && !txReceipt:
      buttonText = "Waiting for confirmation...";
      break;
    case !!txReceipt:
      buttonText = "New Budget Created";
      break;
    case !!error:
      buttonText = "Error";
      break;
    default:
      buttonText = "Create New Budget";
  }

  return (
    <div>
      <h1>New Root Budget</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button onClick={() => newRootBudget?.()} disabled={isLoading || !!txReceipt}>
          {buttonText}
        </button>
        {txHash && <ProcessingMessage hash={txHash} name="New Budget" />}
        {error && <div>Error: {error.message}</div>}
      </div>
    </div>
  );
}
