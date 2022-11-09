import { createModel } from "@rematch/core";

// types
import { RootModel } from ".";
import {
  BankAccount,
  BankAccounts,
  AccountsState,
} from "../models/bank-account";

// Accounts store
export const accounts = createModel<RootModel>()({
  state: {
    records: {},
    status: "initial",
  } as AccountsState,
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
    async getAccounts() {
      dispatch.accounts.setStatus("loading");
      const response = await fetch("//bank-accounts-test.web.app/api/accounts");
      if (response.ok) {
        const accountsArray = await response.json();
        if (accountsArray) {
          dispatch.accounts.update(
            accountsArray.reduce((acc: BankAccounts, account: BankAccount) => {
              acc[account.id] = account;
              return acc;
            }, {} as BankAccounts)
          );
          dispatch.accounts.setStatus("loaded");
        }
      }
    },
  }),
});
