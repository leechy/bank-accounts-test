export type BankAccount = {
  id: string;
  bank?: string;
  account: string;
  currency: string;
  balance: number;
  suspended?: boolean;
};

export type BankAccounts = {
  [accountId: string]: BankAccount;
};

export type AccountsState = {
  records: BankAccounts;
  status: "initial" | "loading" | "loaded";
};
