import { useContractRead } from "wagmi";
import { budgetABI } from "../generated";
import { useStore } from ".";

export function useBudgetCount(watch = true) {
  const { budgetAddress } = useStore();
  const { data: budgetCount, ...rest } = useContractRead({
    address: budgetAddress!,
    abi: budgetABI,
    functionName: "allowancesCount",
    watch,
    enabled: !!budgetAddress,
  });
  return { budgetCount, ...rest };
}
