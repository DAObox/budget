import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLoadDao } from "../hooks/useLoadDao";
import { EthAddress } from "../types/schema";

export function DaoDetails() {
  const { loadDao, dao } = useLoadDao();

  const schema = z.object({
    daoAddress: EthAddress,
  });

  type FormValues = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    loadDao(data.daoAddress);
  };

  return (
    <div>
      <h2>DAO Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>DAO Address</label>
        <input {...register("daoAddress")} />
        {errors.daoAddress && <p>{errors.daoAddress.message}</p>}
        <button type="submit">Submit</button>
        {dao && <pre>{JSON.stringify(dao, null, 2)}</pre>}
      </form>
    </div>
  );
}
