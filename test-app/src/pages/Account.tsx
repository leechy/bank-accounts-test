// hooks
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Typography } from "rmwc";

// components
import AppBar from "../components/AppBar";
import Loader from "../components/Loading";
import { BankAccount } from "../models/bank-account";

// utils
import { balanceString } from "../utils/format";

// types
import { RootState } from "../store";
import { Transaction } from "../models/transaction";
import TransactionsTable from "../components/TransactionsTable";

const Account = () => {
  const params = useParams();
  const accountId = params.accountId;

  const navigate = useNavigate();

  const account = useSelector((state: RootState) =>
    accountId ? state.accounts?.records[accountId] : null
  ) as BankAccount | null;

  const transactions = useSelector((state: RootState) =>
    accountId ? state.transactions?.records : null
  ) as Transaction[] | null;

  return (
    <>
      <AppBar
        back="/accounts"
        title={account?.account || "Loading..."}
        action="Edit"
        actionIcon="edit"
        onAction={() => {
          navigate(`/accounts/${accountId}/edit`);
        }}
      />
      <main className="layout--content account">
        {account ? (
          <>
            <div className="account--card mdc-elevation--z3">
              <Typography
                use="subtitle1"
                tag="h2"
                theme="textSecondaryOnBackground"
              >
                {account.bank || "Unknown Bank"}
              </Typography>
              <Typography use="headline4" tag="h1">
                {account.account || "Untitled Account"}
              </Typography>
              <Typography
                use="headline3"
                tag="h1"
                theme="textPrimaryOnBackground"
              >
                {balanceString(account.balance, account.currency)}
              </Typography>
            </div>
            {transactions && (
              <>
                <Typography use="subtitle2" tag="h3" theme="textPrimary">
                  Transactions
                </Typography>
                <TransactionsTable
                  transactions={transactions.filter(
                    (t) =>
                      t.sourceAccount === accountId ||
                      t.targetAccount === accountId
                  )}
                  selectedAccountId={accountId}
                />
              </>
            )}
          </>
        ) : (
          <Loader />
        )}
      </main>
    </>
  );
};

export default Account;
