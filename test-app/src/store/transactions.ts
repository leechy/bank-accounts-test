import { createModel } from "@rematch/core";

// types
import { RootModel } from ".";
import { Transaction, TransactionsState } from "../models/transaction";

// Transactions store
export const transactions = createModel<RootModel>()({
  state: {
    records: [],
    status: "initial",
  } as TransactionsState,
  reducers: {
    update(state, payload: Transaction[]) {
      return {
        ...state,
        records: payload.sort((a, b) => (a.date < b.date ? 1 : -1)),
      };
    },
    setStatus(state, payload) {
      return {
        ...state,
        status: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async getTransactions() {
      dispatch.transactions.setStatus("loading");
      const response = await fetch(
        "//bank-accounts-test.web.app/api/transactions"
      );
      if (response.ok) {
        const transactions = await response.json();
        if (transactions) {
          dispatch.transactions.update(transactions);
          dispatch.transactions.setStatus("loaded");
        }
      }
    },
    async createTransaction(data: Transaction) {
      const response = await fetch(
        "//bank-accounts-test.web.app/api/transactions",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        dispatch.transactions.getTransactions();
        dispatch.accounts.getAccounts();
      }
    },
  }),
});
