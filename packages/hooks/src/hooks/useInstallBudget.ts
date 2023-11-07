import { useEffect, useState } from "react";

import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { pluginSetupProcessorABI, tokenVotingABI, tokenVotingAddress } from "../generated";
import { DAO__factory, PluginSetupProcessor, PluginSetupProcessor__factory } from "@aragon/osx-ethers";
import { zeroAddress, keccak256, encodeAbiParameters, stringToBytes } from "viem";
import { Permissions, VoteValues } from "@aragon/sdk-client";
import { DAOAction } from "../types";

export function useInstallBudget({
  daoAddress,
  budgetRepoAddress,
  pluginSetupProcessorAddress,
  tokenVotingAddress,
}: {
  daoAddress: `0x${string}`;
  budgetRepoAddress: `0x${string}`;
  pluginSetupProcessorAddress: `0x${string}`;
  tokenVotingAddress: `0x${string}`;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    prepareTxHash,
    txReceipt: prepareTxReceipt,
    error: prepareError,
    isLoading: isPrepareLoading,
    installAction,
    plugin,
    prepareInstallationAsync,
  } = usePrepareInstall({
    daoAddress,
    budgetRepoAddress,
    pluginSetupProcessorAddress,
  });

  const {
    error: installError,
    installProposalAsync,
    installTxHash,
    isLoading: isInstallLoading,
    txReceipt: installTxReceipt,
  } = useInstallProposal({
    installAction,
    daoAddress,
    pluginSetupProcessorAddress,
    tokenVotingAddress,
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

export function usePrepareInstall({
  daoAddress,
  budgetRepoAddress,
  pluginSetupProcessorAddress,
  enabled = true,
}: {
  daoAddress: `0x${string}`;
  budgetRepoAddress: `0x${string}`;

  pluginSetupProcessorAddress: `0x${string}`;
  enabled?: boolean;
}) {
  const pluginSetupRef = {
    versionTag: { release: 1, build: 1 },
    pluginSetupRepo: budgetRepoAddress,
  };

  const { config: prepareInsallConfig, data: prepareData } = usePrepareContractWrite({
    address: pluginSetupProcessorAddress,
    abi: pluginSetupProcessorABI,
    functionName: "prepareInstallation",
    args: [daoAddress, { pluginSetupRef, data: zeroAddress }],
    chainId: 5,
    enabled: !!(daoAddress && budgetRepoAddress && pluginSetupProcessorAddress && enabled),
  });

  const {
    data: prepareTxHash,
    write: prepareInstallation,
    writeAsync: prepareInstallationAsync,
    error,
    isLoading,
  } = useContractWrite(prepareInsallConfig);
  const {
    data: txReceipt,
    error: txError,
    isLoading: isTxLoading,
  } = useWaitForTransaction({
    hash: prepareTxHash?.hash,
  });

  const plugin = prepareData?.result[0];
  const permissions =
    prepareData?.result[1].permissions.map((p: any) => {
      return { ...p, condition: zeroAddress };
    }) ?? [];

  const applyInstallationParams: PluginSetupProcessor.ApplyInstallationParamsStruct = {
    permissions,
    plugin: plugin ?? zeroAddress,
    pluginSetupRef,
    helpersHash: keccak256(encodeAbiParameters([{ name: "addresses", type: "address[]" }], [[]])),
  };

  const installAction = {
    to: pluginSetupProcessorAddress,
    value: 0n,
    data: PluginSetupProcessor__factory.createInterface().encodeFunctionData("applyInstallation", [
      daoAddress,
      applyInstallationParams,
    ]) as `0x${string}`,
  };

  return {
    prepareInstallation,
    prepareInstallationAsync,
    error: error || txError,
    isLoading: isLoading || isTxLoading,
    plugin,
    permissions,
    installAction,
    prepareTxHash,
    txReceipt,
  };
}

export function useInstallProposal({
  voteMetadata = "0x00",
  daoAddress,
  tokenVotingAddress,
  pluginSetupProcessorAddress,
  installAction,
  enabled = true,
}: {
  voteMetadata?: `0x${string}`;
  daoAddress: `0x${string}`;
  tokenVotingAddress: `0x${string}`;
  pluginSetupProcessorAddress: `0x${string}`;
  installAction: DAOAction;
  enabled?: boolean;
}) {
  const daoInterface = DAO__factory.createInterface();

  const grantPSPRoot = {
    to: daoAddress as `0x${string}`,
    value: 0n,
    data: daoInterface.encodeFunctionData("grant", [
      daoAddress,
      pluginSetupProcessorAddress,
      keccak256(stringToBytes(Permissions.ROOT_PERMISSION)),
    ]) as `0x${string}`,
  };

  const revokePSPRoot = {
    to: daoAddress as `0x${string}`,
    value: 0n,
    data: daoInterface.encodeFunctionData("revoke", [
      daoAddress,
      pluginSetupProcessorAddress,
      keccak256(stringToBytes(Permissions.ROOT_PERMISSION)),
    ]) as `0x${string}`,
  };

  const { config } = usePrepareContractWrite({
    address: tokenVotingAddress,
    abi: tokenVotingABI,
    functionName: "createProposal",
    args: [
      voteMetadata,
      [grantPSPRoot, installAction, revokePSPRoot],
      0n, // no failures allowed
      0n, // first start date
      0n, // no end date
      VoteValues.YES, // creator vote yes
      true, // try and execute immediately
    ],
    enabled: !!(daoAddress && installAction && tokenVotingAddress && pluginSetupProcessorAddress && enabled),
  });

  const {
    data: installTxHash,
    write: installProposal,
    writeAsync: installProposalAsync,
    error,
    isLoading,
  } = useContractWrite(config);
  const {
    data: txReceipt,
    error: txError,
    isLoading: isTxLoading,
  } = useWaitForTransaction({
    hash: installTxHash?.hash,
  });

  return {
    installProposal,
    installProposalAsync,
    error: error || txError,
    isLoading: isLoading || isTxLoading,
    installTxHash,
    txReceipt,
  };
}
