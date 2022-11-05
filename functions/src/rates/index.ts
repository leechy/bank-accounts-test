const axios = require("axios");
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { functionsConfig } from "../config";
import { baseCurrency, currencies } from "../../../test-app/src/models/rates";

const APIKey = "qXpetYorv6Qkq3eYJUQJcEfo56jLfYQp";

/**
 * Get the exchange rates from the API once per day
 */
export const daylyRateUpdate = functions.pubsub
  .schedule(functionsConfig.scheduled.daylyRateUpdate)
  .timeZone(functionsConfig.ratesTimezone)
  .onRun(async () => {
    updateRates();
  });

/**
 * Manually retrieve the exchange rates from the API
 */
export const getRates = functions.https.onRequest(async (request, response) => {
  const rates = await updateRates();
  response.json(rates);
});

const updateRates = async () => {
  return axios
    .get(
      `https://api.apilayer.com/exchangerates_data/latest?symbols=${currencies.join(
        "%2C"
      )}&base=${baseCurrency}`,
      {
        headers: {
          apikey: APIKey,
        },
        method: "GET",
      }
    )
    .then((response: any) => {
      // getting date out of the response
      const date = response.data.date;
      // creating a new document for the date with the new rates
      const db = admin.firestore();
      db.collection("rates").doc(date).set(response.data);
      return response.data;
    })
    .catch((err: any) => {
      console.error("updateRates Error", err);
    });
};
