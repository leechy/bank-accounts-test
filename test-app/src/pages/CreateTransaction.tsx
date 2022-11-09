// hooks
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// components
import { FormattedOption, Select, TextField, Typography } from "rmwc";
import AppBar from "../components/AppBar";

// types
import { BankAccounts } from "../models/bank-account";
import { Rates } from "../models/rates";
import { RootState } from "../store";
import { balanceString } from "../utils/format";

const CreateTransaction = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get accounts from the state
  const accounts = useSelector(
    (state: RootState) => state.accounts.records || null
  ) as BankAccounts | null;

  // get the rates
  const rates = useSelector(
    (state: RootState) => state.rates || null
  ) as Rates | null;

  // form data
  const [sourceAmount, setSourceAmount] = useState<number | string>(0);
  const [sourceAccount, setSourceAccount] = useState(params.from);
  const [targetAmount, setTargetAmount] = useState<number | string>(0);
  const [targetAccount, setTargetAccount] = useState(params.to);
  const [sourceAccountError, setSourceAccountError] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const sourceCurrency = useRef<string>();
  const targetCurrency = useRef<string>();
  const rate = useRef(1);

  useEffect(() => {
    if (accounts !== null) {
      if (sourceAccount && accounts[sourceAccount]) {
        sourceCurrency.current = accounts[sourceAccount].currency;
      }
      if (targetAccount && accounts[targetAccount]) {
        targetCurrency.current = accounts[targetAccount].currency;
      }
    }
  }, [accounts, sourceAccount, targetAccount]);

  // Update the rate
  useEffect(() => {
    if (rates !== null && sourceCurrency.current && targetCurrency.current) {
      const sourceRateToBase =
        sourceCurrency.current === rates.base
          ? 1
          : rates.rates[sourceCurrency.current];
      const targetRateToBase =
        targetCurrency.current === rates.base
          ? 1
          : rates.rates[targetCurrency.current];

      rate.current = targetRateToBase / sourceRateToBase;
    }
  }, [rates, sourceCurrency, targetCurrency]);

  // Update the accounts
  // need that to recalculate the amounts right
  const updateAccount = (source: "from" | "to", value: string) => {
    updateCurrencies(source, value);
    if (source === "from") {
      setSourceAccount(value);
      updateAmount("to", sourceAmount, value);
    } else {
      setTargetAccount(value);
      updateAmount("from", targetAmount, value);
    }
  };

  // Update the currencies
  const updateCurrencies = (source: "from" | "to", accountId: string) => {
    if (accounts?.[accountId]) {
      if (source === "from") {
        sourceCurrency.current = accounts[accountId].currency;
      } else {
        targetCurrency.current = accounts[accountId].currency;
      }
      updateRate();
    }
  };

  // Update the rate
  const updateRate = () => {
    if (rates !== null && sourceCurrency.current && targetCurrency.current) {
      const sourceRateToBase =
        sourceCurrency.current === rates.base
          ? 1
          : rates.rates[sourceCurrency.current];
      const targetRateToBase =
        targetCurrency.current === rates.base
          ? 1
          : rates.rates[targetCurrency.current];

      rate.current = targetRateToBase / sourceRateToBase;
    }
  };

  // calculate the "other" amount
  const updateAmount = (
    source: "from" | "to",
    value: number | string,
    accountId?: string
  ) => {
    const amount = parseFloat(value.toString().replace(",", "."));
    let result = 0;
    if (rate.current === 1) {
      result = amount;
    } else if (source === "from") {
      result = amount * rate.current;
    } else {
      result = amount / rate.current;
    }

    if (source === "from") {
      setSourceAmount(amount);
      setTargetAmount(result.toFixed(2));
    } else {
      setSourceAmount(result.toFixed(2));
      setTargetAmount(amount);
    }

    // check if the source account has enough money
    if (accounts) {
      let sourceBalance = 0;
      if (source === "to" && accountId) {
        sourceBalance = accounts[accountId].balance;
      } else if (sourceAccount && accounts[sourceAccount]) {
        sourceBalance = accounts[sourceAccount].balance;
      }
      if (
        sourceBalance > 0 &&
        ((source === "from" && amount > sourceBalance) ||
          (source === "to" && result > sourceBalance))
      ) {
        setSourceAccountError("Not enough money on the account");
      } else {
        setSourceAccountError("");
      }
    }
  };

  // prepare accounts list
  const getAccounts = (type?: "from" | "to"): FormattedOption[] => {
    if (!accounts) return [];

    return Object.keys(accounts)
      .sort((a, b) => accounts[a].account.localeCompare(accounts[b].account))
      .map((id) => {
        const account = accounts[id];
        let label = "";
        // bank name if available
        if (account.bank) {
          label = account.bank + " / ";
        }
        // account name
        label += account.account || "Untitled account";
        // current balance
        label += ` (${balanceString(account.balance, account.currency)})`;

        return {
          label,
          value: account.id,
        };
      });
  };

  const createTransaction = () => {
    if (
      sourceAccountError === "" &&
      sourceAccount &&
      targetAccount &&
      sourceAmount &&
      targetAmount &&
      sourceCurrency.current &&
      targetCurrency.current &&
      rate.current
    ) {
      dispatch.transactions.createTransaction({
        sourceAccount,
        sourceAmount,
        sourceCurrency: sourceCurrency.current,
        targetAccount,
        targetAmount,
        targetCurrency: targetCurrency.current,
        rate: rate.current,
        description,
      });
      navigate(params.from || params.to ? "/accounts" : "/transactions");
    }
  };

  return (
    <>
      <AppBar
        back={params.from || params.to ? "/accounts" : "/transactions"}
        title="Transfer from one account to another"
        action="Transfer"
        actionIcon="send"
        onAction={createTransaction}
      />
      <main className="layout--content account-edit">
        <form>
          <div className="form--field">
            <Select
              label="Transfer from"
              defaultValue={sourceAccount}
              options={getAccounts("from")}
              onChange={(evt: any) => updateAccount("from", evt.target.value)}
              className="form--account-select"
            />
          </div>

          {sourceAccountError !== "" && (
            <Typography
              use="subtitle1"
              tag="p"
              theme="error"
              style={{
                margin: "-0.5rem 0 0.2rem 1rem",
              }}
            >
              {sourceAccountError}
            </Typography>
          )}

          <div className="form--field">
            <TextField
              label="Amount to transfer"
              type="number"
              value={sourceAmount}
              onChange={(evt: any) => updateAmount("from", evt.target.value)}
              theme={["textSecondaryOnLight"]}
              className="form--input"
            />
            {sourceCurrency.current && (
              <div className="form--input--suffix">
                {sourceCurrency.current}
              </div>
            )}
          </div>

          {rate.current !== 1 && (
            <Typography
              use="subtitle1"
              tag="p"
              theme="textSecondaryOnBackground"
              style={{ margin: "1rem" }}
            >
              The currencies of the source and target accounts are different.
              <br />
              The amount will be converted depending which field you are
              updating using the rate:
              <br />1 {sourceCurrency.current} = {rate.current.toFixed(5)}{" "}
              {targetCurrency.current}
            </Typography>
          )}

          <div className="form--field">
            <TextField
              label="Amount to receive"
              type="number"
              value={targetAmount}
              onChange={(evt: any) => updateAmount("to", evt.target.value)}
              theme={["textSecondaryOnLight"]}
              className="form--input"
            />
            {targetCurrency.current && (
              <div className="form--input--suffix">
                {targetCurrency.current}
              </div>
            )}
          </div>

          <div className="form--field">
            <Select
              label="Transfer to"
              defaultValue={targetAccount}
              options={getAccounts("to")}
              onChange={(evt: any) => updateAccount("to", evt.target.value)}
              className="form--account-select"
            />
          </div>

          <div className="form--field">
            <TextField
              textarea
              label="Note"
              type="text"
              value={description}
              onChange={(evt: any) => setDescription(evt.target.value)}
              theme={["textSecondaryOnLight"]}
              className="form--input"
            />
          </div>
        </form>
      </main>
    </>
  );
};

export default CreateTransaction;
