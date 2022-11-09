// hooks
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// components
import AppBar from "../components/AppBar";
import { Checkbox, Select, TextField } from "rmwc";

// types
import { BankAccount } from "../models/bank-account";
import { currencies } from "../models/rates";
import { RootState } from "../store";

const AccountEdit = () => {
  const params = useParams();
  const accountId = params.accountId;

  const navigate = useNavigate();

  const account = useSelector((state: RootState) =>
    accountId ? state.accounts?.records[accountId] : null
  ) as BankAccount | null;

  const dispatch = useDispatch();

  const [bank, setBank] = useState(account?.bank || "");
  const [accountName, setAccountName] = useState(account?.account || "");
  const [balance, setBalance] = useState(account?.balance || "");
  const [currency, setCurrency] = useState(account?.currency || "EUR");
  const [suspended, setSuspended] = useState(account?.suspended || false);

  const updateAccount = () => {
    dispatch.accounts.updateAccount({
      ...account,
      bank,
      balance,
      account: accountName,
      currency,
      suspended,
    });
    navigate(`/accounts/${accountId}`);
  };

  const createAccount = () => {
    dispatch.accounts.createAccount({
      bank,
      balance,
      account: accountName,
      currency,
      suspended,
    });
    navigate("/accounts");
  };

  return (
    <>
      <AppBar
        back={`/accounts${accountId ? `/${accountId}` : ""}`}
        title={
          account?.account ? `Edit ${account.account}` : "Create New Account"
        }
        action="Save"
        actionIcon="save"
        onAction={() => (account ? updateAccount() : createAccount())}
      />
      <main className="layout--content form">
        <form>
          <div className="form--field">
            <TextField
              label="Bank Name"
              type="text"
              value={bank}
              onChange={(evt: any) => setBank(evt.target.value)}
              theme={["textSecondaryOnLight"]}
              className="form--input"
            />
          </div>

          <div className="form--field">
            <TextField
              label="Account"
              type="text"
              value={accountName}
              onChange={(evt: any) => setAccountName(evt.target.value)}
              theme={["textSecondaryOnLight"]}
              className="form--input"
            />
          </div>

          <div className="form--field">
            <TextField
              label="Balance"
              type="number"
              value={balance}
              onChange={(evt: any) => setBalance(evt.target.value)}
              theme={["textSecondaryOnLight"]}
              className="form--input"
            />
            <Select
              label="Currency"
              defaultValue={currency}
              options={["EUR", ...currencies]}
              onChange={(evt: any) => setCurrency(evt.target.value)}
              className="form--currency-select"
            />
          </div>

          <div className="form--field">
            <Checkbox
              label="Suspended"
              checked={suspended}
              onChange={(evt: any) => setSuspended(!!evt.currentTarget.checked)}
              className="form--checkbox"
            />
          </div>
        </form>
      </main>
    </>
  );
};

export default AccountEdit;
