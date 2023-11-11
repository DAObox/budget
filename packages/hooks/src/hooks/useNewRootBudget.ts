import { useContractWrite, useWaitForTransaction } from "wagmi";
import { budgetABI, tokenVotingABI } from "../generated";
import { BytesLike, DAOAction, TimeUnit } from "../types";
import { VoteValues } from "@aragon/sdk-client";
import { encodeFunctionData } from "viem";
import { useStore } from "./useStore";

export interface IEncodeRootBudgetVoteData {
  spender: BytesLike;
  token: BytesLike;
  amount: bigint;
  recurrency: TimeUnit;
  name: string;
  voteMetadata?: BytesLike;
}

export enum NewRootBudgetStatus {
  WaitingForSigner = "Waiting for Signer...",
  WaitingForConfirmation = "Waiting for confirmation...",
  NewBudgetCreated = "New Budget Created",
  Error = "Error",
  Idle = "Create New Budget",
}

type EncodeVoteReturnType =
  | Readonly<
      [
        `0x${string}`,
        Readonly<{
          to: `0x${string}`;
          value: bigint;
          data: `0x${string}`;
        }>[],
        bigint,
        bigint,
        bigint,
        number,
        boolean,
      ]
    >
  | undefined;

export function useNewRootBudget() {
  const { tokenVotingAddress, budgetAddress } = useStore();

  function encodeRootBudgetVote({
    spender,
    token,
    amount,
    recurrency,
    name,
    voteMetadata = "0x00",
  }: IEncodeRootBudgetVoteData): EncodeVoteReturnType {
    if (!budgetAddress) return undefined;
    const action: Array<DAOAction> = [
      {
        to: budgetAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: budgetABI,
          functionName: "createAllowance",
          args: [0n, spender, token, amount, recurrency, name],
        }),
      },
    ];
    return [
      voteMetadata,
      action,
      0n, // no failures allowed
      0n, // first start date
      0n, // no end date
      VoteValues.YES, // creator vote yes
      true, // try and execute immediately
    ];
  }

  const {
    data: tx,
    error,
    isLoading,
    write,
    writeAsync,
  } = useContractWrite({ address: tokenVotingAddress, abi: tokenVotingABI, functionName: "createProposal" });

  const newRootBudget = (data: IEncodeRootBudgetVoteData) => write({ args: encodeRootBudgetVote(data) });
  const newRootBudgetAsync = (data: IEncodeRootBudgetVoteData) => writeAsync({ args: encodeRootBudgetVote(data) });

  const {
    data: txReceipt,
    error: txError,
    isLoading: isTxLoading,
  } = useWaitForTransaction({
    hash: tx?.hash,
  });

  let status: NewRootBudgetStatus;
  switch (true) {
    case (isLoading || isTxLoading) && !tx?.hash:
      status = NewRootBudgetStatus.WaitingForSigner;
      break;
    case (isLoading || isTxLoading) && !!tx?.hash && !txReceipt:
      status = NewRootBudgetStatus.WaitingForConfirmation;
      break;
    case !!txReceipt:
      status = NewRootBudgetStatus.NewBudgetCreated;
      break;
    case !!error:
      status = NewRootBudgetStatus.Error;
      break;
    default:
      status = NewRootBudgetStatus.Idle;
  }

  return {
    status,
    txHash: tx?.hash,
    txReceipt,
    error: error || txError,
    isLoading: isLoading || isTxLoading,
    newRootBudget: !!(tokenVotingAddress && budgetAddress) ? newRootBudget : undefined,
    newRootBudgetAsync: !!(tokenVotingAddress && budgetAddress) ? newRootBudgetAsync : undefined,
  };
}
