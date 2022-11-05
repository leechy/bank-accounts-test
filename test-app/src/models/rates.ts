export type Rates = {
  date: string; // ISO string
  base: string; // base currency
  rates: {
    [key: string]: number; // currency: rate
  };
  timestamp?: number; // timestamp
  success?: boolean;
};

/**
 * Base currecy for all rates
 */
export const baseCurrency = "EUR";

/**
 * List of currencies to get rates for
 */
export const currencies = [
  "USD",
  "GBP",
  "JPY",
  "DKK",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "HKD",
  "NZD",
  "SEK",
  "SGD",
  "ZAR",
];
