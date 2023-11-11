import { useEffect, useState } from "react";
import { useInstallProposal, usePrepareInstall } from ".";

export function useInstallBudget() {
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(false);
    }
  }, [installTxReceipt]);

  async function installPlugin() {
    setIsLoading(true);
    try {
      await prepareInstallationAsync?.();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    installPlugin,
    plugin,
    prepareTxHash,
    prepareTxReceipt,
    installTxHash,
    installTxReceipt,
    error: prepareError || installError,
    isLoading: isLoading || isPrepareLoading || isInstallLoading,
  };
}
