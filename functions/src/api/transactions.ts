import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// getting only the letters and numbers to avoid problems with the path
import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";
const nanoid = customAlphabet(alphanumeric, 14);

import { Transaction } from "../../../test-app/src/models/transaction";
import { getAccountData, updateAccount } from "./accounts";

// Base data for a new account
const blankTransaction: Transaction = {
  date: "",
  sourceAccount: "",
  targetAccount: "",
  sourceCurrency: "",
  targetCurrency: "",
  sourceAmount: 0,
  targetAmount: 0,
  rate: 1,
  description: "",
  status: "pending",
};

export const transactions = functions.https.onRequest(
  async (request, response) => {
    // with the transactions, noone needs to get a single transaction, but all the transactions
    // for a specific account
    let accountId = request.path
      // in case it's requested from the hosting rewrite, remove the path
      .replace("/api/transactions", "")
      // remove the leading slash
      .slice(1);

    // check the request body if exists
    // and store it to `data` variable
    let data: Partial<Transaction> = {};
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

    if (accountId !== "" || request.method === "GET") {
      // it's a request for a specific account
      const transactions = await getTransactions(accountId);
      response.json(transactions);
    } else if (request.method === "POST") {
      // post request means to create a new transaction
      // we need not just to create the transaction object,
      // but also to update the balances of the accounts
      // (checking that the transaction is valid)

      const transactionData = {
        ...blankTransaction,
        ...data,
        date: new Date().toISOString(),
      };

      const sourceAccount = data.sourceAccount
        ? await getAccountData(data.sourceAccount)
        : null;
      const targetAccount = data.targetAccount
        ? await getAccountData(data.targetAccount)
        : null;

      if (sourceAccount) {
        // if the source account exists, check if the transaction is valid
        // Yes, we do allow transactions from unexisting accounts
        if (sourceAccount.suspended) {
          transactionData.status = "cancelled";
          transactionData.error = "Source account is suspended";
          response.status(400).json(transactionData);
          return;
        }
        if (sourceAccount.balance < transactionData.sourceAmount) {
          transactionData.status = "cancelled";
          transactionData.error = "Insufficient funds in the source account";
          response.status(400).json(transactionData);
          return;
        }
        if (sourceAccount.currency !== transactionData.sourceCurrency) {
          transactionData.status = "cancelled";
          transactionData.error = "Invalid currency for the source account";
          response.status(400).json(transactionData);
          return;
        }
      }
      if (targetAccount) {
        if (targetAccount.suspended) {
          transactionData.status = "cancelled";
          transactionData.error = "Target account is suspended";
          response.status(400).json(transactionData);
          return;
        }
        if (targetAccount.currency !== transactionData.targetCurrency) {
          transactionData.status = "cancelled";
          transactionData.error = "Invalid currency for the target account";
          response.status(400).json(transactionData);
          return;
        }
      } else {
        // No, we do not allow transactions to unexisting accounts
        transactionData.status = "cancelled";
        transactionData.error = "Target account does not exist";
        response.status(400).json(transactionData);
        return;
      }

      // TODO: check if the rate is correct

      // if the transaction is valid, create it
      await admin
        .firestore()
        .collection("transactions")
        .doc(transactionData.date.replace(/:/g, ".") + "-" + nanoid())
        .set(transactionData)
        .then(() => {
          // and update the balances of the accounts
          if (sourceAccount) {
            updateAccount(
              sourceAccount.id,
              {
                balance: sourceAccount.balance - transactionData.sourceAmount,
              },
              sourceAccount
            );
          }
          if (targetAccount) {
            updateAccount(
              targetAccount.id,
              {
                balance: targetAccount.balance + transactionData.targetAmount,
              },
              targetAccount
            );
          }
          // return the transaction data
          response.status(201).json(transactionData);
        })
        .catch((err) => {
          response.status(500).send(err);
        });
    }
  }
);

/**
 * Returns all transactions or filtered for a specific account
 *
 * @param accountId optional account ID
 * @returns Transaction[]
 */
const getTransactions = async (accountId?: string): Promise<Transaction[]> => {
  if (accountId) {
    // have to combine the sourceAccount and targetAccount fields
    // and in Firestore there is no OR operator, so we have to do it manually
    const sourceTransactions = await admin
      .firestore()
      .collection("transactions")
      .where("sourceAccount", "==", accountId)
      .get();
    const targetTransactions = await admin
      .firestore()
      .collection("transactions")
      .where("targetAccount", "==", accountId)
      .get();

    return sourceTransactions.docs
      .map((doc) => doc.data() as Transaction)
      .concat(targetTransactions.docs.map((doc) => doc.data() as Transaction));
  } else {
    // if no account ID is provided, return all transactions
    const transactions = await admin
      .firestore()
      .collection("transactions")
      .get();
    return transactions.docs.map((doc) => doc.data() as Transaction);
  }
};
