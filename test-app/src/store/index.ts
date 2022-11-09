import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";
import { accounts } from "./accounts";
import { rates } from "./rates";
import { transactions } from "./transactions";

// export the state model interface
export interface RootModel extends Models<RootModel> {
  accounts: typeof accounts;
  transactions: typeof transactions;
  rates: typeof rates;
}
const models: RootModel = { accounts, transactions, rates };

export const store = init({
  models,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
