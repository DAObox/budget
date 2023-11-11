import { useBudgetCount } from "../hooks/useBudgetCount";
import { useStore } from "../hooks";

export function BudgetSelector() {
  const { setActiveBudget } = useStore();
  const { budgetCount } = useBudgetCount();

  return (
    <>
      {budgetCount ? (
        <div>
          <h2>Budgets</h2>
          {Array.from({ length: Number(budgetCount) }, (_, index) => (
            <button key={index} onClick={() => setActiveBudget((index + 1).toString())}>
              Budget ID: {index + 1}
            </button>
          ))}
        </div>
      ) : (
        <h2>No Budgets</h2>
      )}
    </>
  );
}
