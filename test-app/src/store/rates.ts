import { createModel } from "@rematch/core";

// types
import { RootModel } from ".";
import { Rates } from "../models/rates";

// Rates store
export const rates = createModel<RootModel>()({
  state: {
    // mocking the rates when untill we have the real data
    base: "EUR",
    date: "2022-11-06",
    rates: {
      AUD: 1.543764,
      CAD: 1.345729,
      CHF: 0.996466,
      CNY: 7.173202,
      DKK: 7.459992,
      GBP: 0.87748,
      HKD: 7.837216,
      JPY: 146.378799,
      NZD: 1.68541,
      SEK: 10.989902,
      SGD: 1.400492,
      USD: 0.998352,
      ZAR: 17.87424,
    },
  } as Rates,
  reducers: {
    update(_, payload) {
      return payload;
    },
  },
  effects: (dispatch) => ({
    async getRates() {
      const response = await fetch("//bank-accounts-test.web.app/api/rates");
      if (response.ok) {
        const rates = await response.json();
        if (rates) {
          dispatch.rates.update(rates);
        }
      }
    },
  }),
});
