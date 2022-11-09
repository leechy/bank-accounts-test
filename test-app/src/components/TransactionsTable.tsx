// hooks
import { useSelector } from "react-redux";

// components
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableContent,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
  Typography,
} from "rmwc";

// utils
import { balanceString, dateString } from "../utils/format";

// types
import { Transaction } from "../models/transaction";
import { RootState } from "../store";
import React from "react";

type TransactionsTableProps = {
  transactions: Transaction[];
  selectedAccountId?: string;
};

const TransactionsTable = ({
  transactions,
  selectedAccountId,
}: TransactionsTableProps) => {
  const accounts = useSelector((state: RootState) => state.accounts.records);

  const getAccountName = (accountId: string) => {
    if (accounts[accountId]) {
      return (
        <>
          <small>{accounts[accountId].bank}</small>
          <br />
          {accounts[accountId].account}
        </>
      );
    }
    return "Unknown Account";
  };

  if (transactions.length === 0) {
    return (
      <Typography
        use="subtitle1"
        tag="h2"
        theme="textSecondaryOnBackground"
        style={{ marginLeft: "1rem" }}
      >
        No transactions found.
      </Typography>
    );
  }

  return (
    <div className="transactions-table">
      <DataTable>
        <DataTableContent>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>Date and Time</DataTableHeadCell>
              <DataTableHeadCell>From</DataTableHeadCell>
              <DataTableHeadCell className="transaction--number">
                Transferred
              </DataTableHeadCell>
              <DataTableHeadCell className="transaction--number">
                Rate
              </DataTableHeadCell>
              <DataTableHeadCell>To</DataTableHeadCell>
              <DataTableHeadCell className="transaction--number">
                Credited
              </DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {transactions.map((transaction) => {
              const className =
                transaction.status === "cancelled"
                  ? "transaction--error"
                  : transaction.status === "pending"
                  ? "transaction--pending"
                  : "";
              return (
                <React.Fragment key={transaction.date}>
                  <DataTableRow>
                    <DataTableCell className={className}>
                      {dateString(transaction.date)}
                    </DataTableCell>
                    <DataTableCell
                      className={`${className} ${
                        transaction.sourceAccount === selectedAccountId
                          ? "transaction--account"
                          : ""
                      }`}
                    >
                      {getAccountName(transaction.sourceAccount)}
                    </DataTableCell>
                    <DataTableCell
                      className={`${className} transaction--number`}
                    >
                      {balanceString(
                        transaction.sourceAmount,
                        transaction.sourceCurrency
                      )}
                    </DataTableCell>
                    <DataTableCell
                      className={`${className} transaction--number`}
                    >
                      {transaction.rate === 1
                        ? "—"
                        : transaction.rate.toFixed(5)}
                    </DataTableCell>
                    <DataTableCell
                      className={`${className} ${
                        transaction.targetAccount === selectedAccountId
                          ? "transaction--account"
                          : ""
                      }`}
                    >
                      {getAccountName(transaction.targetAccount)}
                    </DataTableCell>
                    <DataTableCell
                      className={`${className} transaction--number`}
                    >
                      {balanceString(
                        transaction.targetAmount,
                        transaction.targetCurrency
                      )}
                    </DataTableCell>
                  </DataTableRow>
                  {(transaction.error || transaction.description) && (
                    <DataTableRow className="transaction--note-row">
                      <DataTableCell
                        colSpan={6}
                        className={`${className} transaction--note`}
                      >
                        {transaction.error || transaction.description}
                      </DataTableCell>
                    </DataTableRow>
                  )}
                </React.Fragment>
              );
            })}
          </DataTableBody>
        </DataTableContent>
      </DataTable>
    </div>
  );
};

export default TransactionsTable;
