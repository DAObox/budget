import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetPlugin } from "../hooks/useGetPlugin";
import { useGetDao } from "../hooks/useGetDao";
import { useEffect } from "react";
import { useStore } from "../hooks";
import { EthAddress } from "../types/schema";
import { BytesLike } from "../types";

export function DaoDetails() {
  const { setTokenVotingAddress, setBudgetAddress, setDaoAddress } = useStore();

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

  const { dao } = useGetDao();
  const { plugin: Budget } = useGetPlugin("budget");
  const { plugin: TokenVoting } = useGetPlugin("token-voting");

  const onSubmit = (data: FormValues) => {
    setDaoAddress(data.daoAddress as BytesLike);
  };

  useEffect(() => {
    if (Budget?.pluginAddress) {
      setBudgetAddress(Budget.pluginAddress);
    }
  }, [Budget]);

  useEffect(() => {
    if (TokenVoting?.pluginAddress) {
      setTokenVotingAddress(TokenVoting.pluginAddress);
    }
  }, [TokenVoting]);

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
