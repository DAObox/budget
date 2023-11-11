import { useBudgetInfo } from "../hooks/useBudgetInfo";
import { stringifyWithBigInt } from "../lib/strings";

export function BudgetInfo() {
  const { budgetInfo } = useBudgetInfo();

  return (
    <div>
      <h2>Budget Info</h2>
      {budgetInfo && <pre>{stringifyWithBigInt(budgetInfo)}</pre>}
    </div>
  );
}
