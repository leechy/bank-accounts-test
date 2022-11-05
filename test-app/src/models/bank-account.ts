export type BankAccount = {
  id: string;
  bank?: string;
  account: string;
  currency: string;
  balance: number;
  suspended?: boolean;
};
