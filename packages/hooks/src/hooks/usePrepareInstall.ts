import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { pluginSetupProcessorABI } from "../generated";
import { PluginSetupProcessor, PluginSetupProcessor__factory } from "@aragon/osx-ethers";
import { zeroAddress, keccak256, encodeAbiParameters } from "viem";
import { budgetRepoAddress, pluginSetupProcessorAddress } from "../lib/constants";
import { useStore } from ".";
import { BytesLike } from "../types";

export function usePrepareInstall(enabled = true) {
  const { daoAddress } = useStore();
  const pluginSetupRef = {
    versionTag: { release: 1, build: 1 },
    pluginSetupRepo: budgetRepoAddress,
  };

  const { config: prepareInsallConfig, data: prepareData } = usePrepareContractWrite({
    address: pluginSetupProcessorAddress,
    abi: pluginSetupProcessorABI,
    functionName: "prepareInstallation",
    args: [daoAddress!, { pluginSetupRef, data: zeroAddress }],
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
      daoAddress!,
      applyInstallationParams,
    ]) as BytesLike,
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
