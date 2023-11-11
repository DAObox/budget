import { NewRootBudgetStatus, useNewRootBudget } from "../hooks/useNewRootBudget";

import { ProcessingMessage } from "../components/ProcessingMessage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimeUnit } from "../types";

import { RootBudgetFormType, rootBudgetSchema } from "../types/schema";

export function NewRootBudget() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RootBudgetFormType>({
    resolver: zodResolver(rootBudgetSchema),
  });

  const { error, newRootBudget, txHash, status } = useNewRootBudget();

  const isButtonDisabled =
    status === NewRootBudgetStatus.WaitingForSigner || status === NewRootBudgetStatus.WaitingForConfirmation;

  const onSubmit = (data: RootBudgetFormType) => {
    console.log(data);

    newRootBudget?.(data);
  };

  return (
    <div>
      <h1>New Root Budget</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <input {...register("spender")} placeholder="Spender" />
          {errors.spender && <div>{errors.spender.message}</div>}

          <input {...register("token")} placeholder="Token" />
          {errors.token && <div>{errors.token.message}</div>}

          <input {...register("amount")} placeholder="Amount" type="number" />
          {errors.amount && <div>{errors.amount.message}</div>}

          <select {...register("recurrency")}>
            {Object.entries(TimeUnit).map(([key, value], index) => (
              <option key={value} value={value} disabled={index === 0} style={index === 0 ? { color: "gray" } : {}}>
                {key}
              </option>
            ))}
          </select>
          {errors.recurrency && <div>{errors.recurrency.message}</div>}

          <input {...register("name")} placeholder="Name" />
          {errors.name && <div>{errors.name.message}</div>}

          <button type="submit" disabled={isButtonDisabled}>
            {status}
          </button>
          {txHash && <ProcessingMessage hash={txHash} name="New Budget" />}
          {error && <div>Error: {error.message}</div>}
        </div>
      </form>
    </div>
  );
}
