import { useEffect, useState } from "react";
import { useInstallProposal, usePrepareInstall } from ".";

export enum InstallBudgetStatus {
  WaitingForSigner = "Waiting for Signer...",
  WaitingForPreperationConfirmation = "Waiting for confirmation...",
  WaitingForInstallConfirmation = "Waiting for Install confirmation...",
  BudgetInstalled = "Budget Installed",
  Error = "Error",
  Idle = "Install Budget",
}

export function useInstallBudget() {
  const [isHookLoading, setIsHookLoading] = useState(false);
  const {
    prepareTxHash,
    txReceipt: prepareTxReceipt,
    error: prepareError,
    isLoading: isPrepareLoading,
    installAction,
    plugin,
    prepareInstallationAsync,
  } = usePrepareInstall();

  const {
    error: installError,
    installProposalAsync,
    installTxHash,
    isLoading: isInstallLoading,
    txReceipt: installTxReceipt,
  } = useInstallProposal({
    installAction,
    enabled: !!prepareTxReceipt,
  });

  // call installProposalAsync when prepareTxReceipt is ready
  useEffect(() => {
    if (prepareTxReceipt && installProposalAsync) installProposalAsync();
  }, [prepareTxReceipt, installProposalAsync]);

  // set loading to false when installTxReceipt is ready
  useEffect(() => {
    if (installTxReceipt || prepareError || installError) {
      setIsHookLoading(false);
    }
  }, [installTxReceipt]);

  async function installPlugin() {
    setIsHookLoading(true);
    try {
      await prepareInstallationAsync?.();
    } catch (error) {
      throw error;
    } finally {
      setIsHookLoading(false);
    }
  }

  const error = prepareError || installError;
  const isLoading = isHookLoading || isPrepareLoading || isInstallLoading;

  let status: InstallBudgetStatus;
  switch (true) {
    case isLoading && !prepareTxHash && !installTxHash:
      status = InstallBudgetStatus.WaitingForSigner;
      break;
    case isLoading && !!prepareTxHash && !prepareTxReceipt:
      status = InstallBudgetStatus.WaitingForPreperationConfirmation;
    case isLoading && !!prepareTxReceipt && !installTxHash:
      status = InstallBudgetStatus.WaitingForSigner;
      break;
    case isLoading && !!installTxHash && !installTxReceipt:
      status = InstallBudgetStatus.WaitingForInstallConfirmation;
      break;
    case !!installTxReceipt:
      status = InstallBudgetStatus.BudgetInstalled;
    case !!error:
      status = InstallBudgetStatus.Error;
      break;
    default:
      status = InstallBudgetStatus.Idle;
  }

  return {
    status,
    installPlugin,
    plugin,
    prepareTxHash,
    prepareTxReceipt,
    installTxHash,
    installTxReceipt,
    error,
    isLoading: isHookLoading || isPrepareLoading || isInstallLoading,
  };
}
