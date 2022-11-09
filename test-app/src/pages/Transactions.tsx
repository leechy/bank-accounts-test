// hooks
import { useEffect } from "react";
import { useSelector } from "react-redux";

// components
import AppBar from "../components/AppBar";
import Loading from "../components/Loading";
import TransactionsTable from "../components/TransactionsTable";
import { Fab } from "rmwc";

// types
import { TransactionsState } from "../models/transaction";
import { RootState, store } from "../store";

const Transactions = () => {
  // get the accounts from the state
  const transactions = useSelector(
    (state: RootState) => state.transactions
  ) as TransactionsState;

  // update the accounts in the state when the component is mounted
  useEffect(() => {
    store.dispatch.transactions.getTransactions();
  }, []);

  return (
    <>
      <AppBar title="Transactions Log" />
      <main className="layout--content">
        <div className="transactions--container">
          {transactions.status === "loaded" ? (
            <>
              <div className="action--container">
                <Fab icon="add" label="Create New Transaction" />
              </div>
              <TransactionsTable transactions={transactions.records} />
            </>
          ) : (
            <Loading />
          )}
        </div>
      </main>
    </>
  );
};

export default Transactions;
