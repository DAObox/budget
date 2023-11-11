import { isAddress } from "viem";
import { z } from "zod";
import { BytesLike, TimeUnit } from ".";

export const EthAddress = z.string().refine((value) => isAddress(value), {
  message: "Value must be a valid Ethereum address",
}) as unknown as z.ZodType<BytesLike>;
export const rootBudgetSchema = z.object({
  spender: EthAddress,
  token: EthAddress,
  amount: z.string().transform((value) => BigInt(value)),
  recurrency: z.nativeEnum(TimeUnit),
  name: z.string(),
  // voteMetadata: EthAddress,
});
export type RootBudgetFormType = z.infer<typeof rootBudgetSchema>;
