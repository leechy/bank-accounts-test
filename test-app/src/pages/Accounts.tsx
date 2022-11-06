import AccountCard from "../components/AccountCard";
import AppBar from "../components/AppBar";

const Accounts = () => {
  const createNewAccount = () => {
    console.log("Create new account");
  };

  return (
    <>
      <AppBar
        title="Accounts"
        action="New"
        actionIcon="add"
        onAction={() => createNewAccount()}
      />
      <main className="layout--content">
        <div className="accounts--container">
          <AccountCard
            bank="Bank of America"
            account="123456789"
            balance={1234.56}
            currency="USD"
          />
          <AccountCard balance={1500000} currency="GBP" />
          <AccountCard
            bank="BGL BNP Paribas"
            account="VISA Gold Card"
            balance={2734.5235001}
            currency="EUR"
          />
          <AccountCard
            bank="ING"
            account="Orange Account"
            balance={29491.23}
            currency="JPY"
          />
        </div>
      </main>
    </>
  );
};

export default Accounts;
