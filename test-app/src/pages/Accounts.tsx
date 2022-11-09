// hooks
import { useEffect } from "react";
import { useSelector } from "react-redux";

// components
import AccountCard from "../components/AccountCard";
import AppBar from "../components/AppBar";
import Loading from "../components/Loading";
import { AccountsState } from "../models/bank-account";
import { Fab } from "rmwc";
import { Link } from "react-router-dom";

// types
import { RootState, store } from "../store";

const Accounts = () => {
  // get the accounts from the state
  const accounts = useSelector(
    (state: RootState) => state.accounts
  ) as AccountsState;

  // update the accounts in the state when the component is mounted
  useEffect(() => {
    if (accounts?.status !== "loading") {
      store.dispatch.accounts.getAccounts();
    }
  }, []);

  return (
    <>
      <AppBar title="Accounts" />
      <main className="layout--content accounts">
        <div className="action--container">
          <Fab
            icon="add"
            label="New Account"
            theme={["textPrimaryOnLight"]}
            style={{ fontSize: "0.8rem", height: "32px" }}
            mini
            tag={Link}
            to="/accounts/new"
          />
        </div>
        {accounts?.status === "loaded" ? (
          <div className="accounts--container">
            {accounts.records &&
              Object.keys(accounts.records)
                .sort((a, b) =>
                  accounts.records[a].account.localeCompare(
                    accounts.records[b].account
                  )
                )
                .map((account) => (
                  <AccountCard key={account} {...accounts.records[account]} />
                ))}
          </div>
        ) : (
          <Loading />
        )}
      </main>
    </>
  );
};

export default Accounts;
