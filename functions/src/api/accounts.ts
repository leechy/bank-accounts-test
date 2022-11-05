import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// getting only the letters and numbers to avoid problems with the path
import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";
const nanoid = customAlphabet(alphanumeric, 14);

import { BankAccount } from "../../../test-app/src/models/bank-account";

// Base data for a new account
const blankAccount: BankAccount = {
  id: "",
  bank: "",
  account: "Untitled Account",
  balance: 0,
  currency: "EUR",
  suspended: false,
};

export const accounts = functions.https.onRequest(async (request, response) => {
  let requestId = request.path
    // in case it's requested from the hosting rewrite, remove the path
    .replace("/api/accounts", "")
    // remove the leading slash
    .slice(1);

  // check the request body if exists
  // and store it to `data` variable
  let data: Partial<BankAccount> = {};
  if (request.body) {
    try {
      if (typeof request.body === "string") {
        data = JSON.parse(request.body);
      } else {
        data = request.body;
      }
    } catch (err) {
      response.status(500).send(err);
    }
  }

  if (requestId !== "") {
    // it is a request for a specific account
    const account = await getAccountData(requestId);

    if (account) {
      if (
        request.method === "POST" ||
        request.method === "PUT" ||
        request.method === "PATCH"
      ) {
        // in any of these requests, we are going to update the account
        updateAccount(requestId, data, account);
      }
      // no support for the other methods in this demo

      // return the updated account data
      const updatedAccount = await getAccountData(requestId);
      response.json(updatedAccount);
    } else {
      // if the account doesn't exist, return an error
      response.status(404).send("Account not found");
    }
  } else {
    // if it's a request for all accounts
    if (request.method === "POST" || request.method === "PUT") {
      // if it's a post or put request, then create a new account
      createAccount(data);
    }
    // no support for the other methods in this demo

    // return all accounts as a response to any successful request
    if ((response.statusCode || 200) < 299) {
      const accounts = await getAllAccounts();
      response.json(accounts);
    }
  }
});

/**
 * Retrieves a single account from the database
 *
 * @param accountId
 * @returns AccountObject
 */
export const getAccountData = async (accountId: string) => {
  const db = admin.firestore();
  const account = await db.collection("accounts").doc(accountId).get();
  if (account.exists) {
    return account.data() as BankAccount;
  } else {
    return null;
  }
};

/**
 * Retrieves all accounts from the database
 *
 * @returns Array<BankAccount>
 */
const getAllAccounts = async () => {
  const db = admin.firestore();
  const accounts = await db.collection("accounts").get();
  return accounts.docs.map((doc) => doc.data()) as BankAccount[];
};

/**
 * Creates a new account in the database
 *
 * @param data
 * @returns void
 */
const createAccount = async (data: Partial<BankAccount>) => {
  const db = admin.firestore();
  const id = nanoid();
  await db
    .collection("accounts")
    .doc(id)
    .set({
      ...blankAccount,
      ...data,
      id,
    });
};

/**
 * Updates an account in the database
 *
 * @param accountId
 * @param newData
 * @param oldData
 * @returns void
 */
export const updateAccount = async (
  accountId: string,
  newData: Partial<BankAccount>,
  oldData: BankAccount
) => {
  const db = admin.firestore();
  await db
    .collection("accounts")
    .doc(accountId)
    .update({
      ...(oldData || {}),
      ...newData,
      id: accountId,
    });
};
