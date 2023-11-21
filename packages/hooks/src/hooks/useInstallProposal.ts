import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { tokenVotingABI } from "../generated";
import { DAO__factory } from "@aragon/osx-ethers";
import { keccak256, stringToBytes } from "viem";
import { Permissions, VoteValues } from "@aragon/sdk-client";
import { BytesLike, DAOAction } from "../types";
import { pluginSetupProcessorAddress } from "../lib/constants";
import { useStore } from ".";
import { useIsTokenVotingMember } from "./useIsMember";

export function useInstallProposal({
  voteMetadata = "0x00",
  installAction,
  enabled = true,
}: {
  voteMetadata?: BytesLike;
  installAction: DAOAction;
  enabled?: boolean;
}) {
  const { daoAddress, tokenVotingAddress } = useStore();
  const { isMember } = useIsTokenVotingMember();

  const daoInterface = DAO__factory.createInterface();

  const grantPSPRoot = {
    to: daoAddress as BytesLike,
    value: 0n,
    data: daoInterface.encodeFunctionData("grant", [
      daoAddress!,
      pluginSetupProcessorAddress,
      keccak256(stringToBytes(Permissions.ROOT_PERMISSION)),
    ]) as BytesLike,
  };

  const revokePSPRoot = {
    to: daoAddress as BytesLike,
    value: 0n,
    data: daoInterface.encodeFunctionData("revoke", [
      daoAddress!,
      pluginSetupProcessorAddress,
      keccak256(stringToBytes(Permissions.ROOT_PERMISSION)),
    ]) as BytesLike,
  };

  const { config } = usePrepareContractWrite({
    address: tokenVotingAddress!,
    abi: tokenVotingABI,
    functionName: "createProposal",
    args: [
      voteMetadata,
      [grantPSPRoot, installAction, revokePSPRoot],
      0n,
      0n,
      0n,
      VoteValues.YES,
      true, // try and execute immediately
    ],
    enabled: !!(
      daoAddress &&
      installAction &&
      tokenVotingAddress &&
      pluginSetupProcessorAddress &&
      enabled &&
      isMember
    ),
  });

  console.log({
    daoAddress: !!daoAddress,
    installAction: !!installAction,
    tokenVotingAddress: !!tokenVotingAddress,
    pluginSetupProcessorAddress: !!pluginSetupProcessorAddress,
    enabled,
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
