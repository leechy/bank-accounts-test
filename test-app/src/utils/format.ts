/**
 * Returns a formatted string with the amount
 * and the currency symbol in the en-GB locale
 *
 * @param balance  The current balance of the account
 * @param currency  The currency of the account
 * @returns string
 */
export const balanceString = (balance: number, currency: string): string => {
  return balance.toLocaleString("en-GB", {
    style: "currency",
    currency,
  });
};

/**
 * Returns a formatted string with a date
 * in the en-GB locale (so the months are not in the first place)
 *
 * @param date  The date to format
 * @returns string
 */
export const dateString = (date: string): string => {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
