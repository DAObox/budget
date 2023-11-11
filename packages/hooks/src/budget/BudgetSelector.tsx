import { useBudgetCount } from "../hooks/useBudgetCount";
import { useStore } from "../hooks";

export function BudgetSelector() {
  const { dispatch } = useStore();
  const { budgetCount } = useBudgetCount();

  return (
    <>
      {budgetCount ? (
        <div>
          <h2>Budgets</h2>
          {Array.from({ length: Number(budgetCount) }, (_, index) => (
            <button
              key={index}
              onClick={() => dispatch({ type: "SET_ACTIVE_BUDGET", payload: (index + 1).toString() })}
            >
              Budget ID: {(index + 1).toString()}
            </button>
          ))}
        </div>
      ) : (
        <h2>No Budgets</h2>
      )}
    </>
  );
}
