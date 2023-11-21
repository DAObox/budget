import { useContractWrite, useWaitForTransaction } from "wagmi";
import { BytesLike } from "../types";
import { useStore } from "./useStore";
import { budgetABI } from "../generated";

export interface IUsePayment {
  budgetId: string | number | bigint;
  to: BytesLike;
  amount: string | number | bigint;
  description: string;
}

export enum UsePaymentStatus {
  WaitingForSigner = "Waiting for Signer...",
  WaitingForConfirmation = "Waiting for confirmation...",
  PaymentExecuted = "Payment Executed",
  Error = "Error",
  Idle = "Exewcute Payment",
}

export function usePayment() {
  const { budgetAddress } = useStore();

  const {
    data: tx,
    write,
    writeAsync,
    isLoading: isWriteLoading,
    isError: isWriteError,
    error: writeError,
  } = useContractWrite({
    address: budgetAddress!,
    abi: budgetABI,
    functionName: "executePayment",
  });

  const {
    data: txReceipt,
    error: txError,
    isLoading: isTxLoading,
  } = useWaitForTransaction({
    hash: tx?.hash,
  });

  const isLoading = isWriteLoading || isTxLoading;
  const isError = isWriteError || txError;
  const error = writeError || txError;

  let status: UsePaymentStatus;
  switch (true) {
    case isLoading && !tx?.hash:
      status = UsePaymentStatus.WaitingForSigner;
      break;
    case isLoading && !!tx?.hash && !txReceipt:
      status = UsePaymentStatus.WaitingForConfirmation;
      break;
    case !!txReceipt:
      status = UsePaymentStatus.PaymentExecuted;
      break;
    case isError:
      status = UsePaymentStatus.Error;
      break;
    default:
      status = UsePaymentStatus.Idle;
  }

  const executePayment = ({ budgetId, to, amount, description }: IUsePayment) =>
    write({ args: [BigInt(budgetId), to, BigInt(amount), description] });
  const executePaymentAsync = ({ budgetId, to, amount, description }: IUsePayment) =>
    writeAsync({ args: [BigInt(budgetId), to, BigInt(amount), description] });

  return {
    status,
    txHash: tx?.hash,
    txReceipt,
    error,
    isLoading,
    executePayment: !!budgetAddress ? executePayment : undefined,
    executePaymentAsync: !!budgetAddress ? executePaymentAsync : undefined,
  };
}
