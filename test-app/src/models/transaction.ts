export type Transaction = {
  sourceAccount: string;
  sourceCurrency: string;
  sourceAmount: number;
  targetAccount: string;
  targetCurrency: string;
  targetAmount: number;
  rate: number;
  date: string; // ISO string
  description: string;
  status: TransactionStatus;
  error?: string;
};

export type TransactionStatus = "pending" | "completed" | "cancelled";
