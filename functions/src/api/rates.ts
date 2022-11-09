import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const rates = functions.https.onRequest(async (request, response) => {
  // for the rates it's simpler than the accounts
  // we just have to retrieve the rates from the database
  // and return them as a JSON
  const latestRates = await getLatestRates();
  response
    .status(200)
    .header({
      "Access-Control-Allow-Origin": "*",
    })
    .json(latestRates);
});

/**
 * Retrieves the latest rates from the database
 */
export const getLatestRates = async () => {
  const db = admin.firestore();
  const latestRates = await db
    .collection("rates")
    .orderBy("date", "desc")
    .limit(1)
    .get();
  return latestRates.docs[0].data();
};
