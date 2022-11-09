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
    update(state, payload) {
      return {
        ...state,
        records: payload,
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
  }),
});
