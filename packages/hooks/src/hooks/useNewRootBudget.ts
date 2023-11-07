import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { budgetABI, tokenVotingABI } from "../generated";
import { DAOAction, TimeUnit } from "../types";
import { VoteValues } from "@aragon/sdk-client";
import { encodeFunctionData } from "viem";

export function useNewRootBudget({
  spender,
  token,
  amount,
  recurrency,
  name,
  budgetAddress,
  tokenVotingAddress,
  voteMetadata = "0x00",
  enabled = true,
}: {
  voteMetadata?: `0x${string}`;
  spender: `0x${string}`;
  token: `0x${string}`;
  amount: bigint;
  recurrency: TimeUnit;
  name: string;
  budgetAddress: `0x${string}`;
  tokenVotingAddress: `0x${string}`;
  enabled?: boolean;
}) {
  const action: DAOAction = {
    to: budgetAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: budgetABI,
      functionName: "createAllowance",
      args: [0n, spender, token, amount, recurrency, name],
    }),
  };

  const { config } = usePrepareContractWrite({
    address: tokenVotingAddress,
    abi: tokenVotingABI,
    functionName: "createProposal",
    args: [
      voteMetadata,
      [action],
      0n, // no failures allowed
      0n, // first start date
      0n, // no end date
      VoteValues.YES, // creator vote yes
      true, // try and execute immediately
    ],
    enabled: !!(
      tokenVotingAddress &&
      budgetAddress &&
      spender &&
      token &&
      amount &&
      recurrency &&
      name &&
      voteMetadata &&
      enabled
    ),
  });

  const { data: tx, error, isLoading, write: newRootBudget, writeAsync: newRootBudgetAsync } = useContractWrite(config);

  const {
    data: txReceipt,
    error: txError,
    isLoading: isTxLoading,
  } = useWaitForTransaction({
    hash: tx?.hash,
  });

  return {
    txHash: tx?.hash,
    txReceipt,
    error: error || txError,
    isLoading: isLoading || isTxLoading,
    newRootBudget,
    newRootBudgetAsync,
  };
}
