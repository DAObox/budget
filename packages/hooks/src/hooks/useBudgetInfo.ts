import { useContractRead } from "wagmi";
import { budgetABI } from "../generated";
import { useStore } from ".";
import { BudgetInfo, BytesLike } from "../types";

export function useBudgetInfo({ budgetId }: { budgetId?: string | bigint | number | undefined } = {}) {
  const { budgetAddress, activeBudget } = useStore();
  const budget = budgetId ?? activeBudget;
  const {
    data: budgetInfo,
    error,
    isLoading,
    refetch,
  } = useContractRead({
    address: budgetAddress!,
    abi: budgetABI,
    functionName: "allowances",
    args: [budget ? BigInt(budget!) : 0n],
    enabled: !!(budget && budgetAddress),
  });
  return { budgetInfo: budgetInfo ? parseBudgetInfo(budgetInfo) : undefined, error, isLoading, refetch };
}

function parseBudgetInfo(
  budgetInfoArray: readonly [bigint, bigint, bigint, BytesLike, number, BytesLike, BytesLike, boolean] | undefined,
): BudgetInfo | undefined {
  if (!budgetInfoArray) return undefined;
  const [parentId, amount, spent, token, nextResetTime, spender, recurrency, isDisabled] = budgetInfoArray;

  return {
    parentId: BigInt(parentId),
    amount: BigInt(amount),
    spent: BigInt(spent),
    token: token as string,
    nextResetTime: new Date(Number(nextResetTime) * 1000).toDateString(),
    spender: spender as string,
    recurrency: BigInt(recurrency),
    isDisabled: isDisabled as boolean,
  };
}
