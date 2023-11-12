import { useBudgetInfo } from "../hooks/useBudgetInfo";
import { UsePaymentStatus, usePayment } from "../hooks/usePayment";
import { stringifyWithBigInt } from "../lib/strings";

export function BudgetInfo() {
  const { budgetInfo } = useBudgetInfo();
  const { status, executePaymentAsync } = usePayment();

  const disabled = status === UsePaymentStatus.WaitingForConfirmation || status === UsePaymentStatus.WaitingForSigner;

  const handleExecutePayment = () => {
    executePaymentAsync?.({
      amount: 42069n,
      budgetId: 6,
      description: "testing",
      to: "0x47d80912400ef8f8224531EBEB1ce8f2ACf4b75a",
    });
  };

  return (
    <div>
      <h2>Budget Info</h2>
      {budgetInfo && (
        <div>
          <pre>{stringifyWithBigInt(budgetInfo)}</pre>
          <button disabled={disabled} onClick={() => handleExecutePayment()}>
            {status}
          </button>
        </div>
      )}
    </div>
  );
}
