export type BytesLike = `0x${string}`;

export interface DAOAction {
  to: BytesLike;
  value: bigint;
  data: BytesLike;
}

export enum TimeUnit {
  Inherit = "0x000000000000",
  Daily = "0x010000000000",
  Weekly = "0x020000000000",
  Monthly = "0x030000000000",
  Quarterly = "0x040000000000",
  Semiyearly = "0x050000000000",
  Yearly = "0x060000000000",
  NonRecurrent = "0x070000000000",
}

export interface BudgetInfo {
  parentId: bigint;
  amount: bigint;
  spent: bigint;
  token: string;
  nextResetTime: string;
  spender: string;
  recurrency: bigint;
  isDisabled: boolean;
}
