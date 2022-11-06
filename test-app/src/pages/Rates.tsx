import { SimpleDataTable, Typography } from "rmwc";
import AppBar from "../components/AppBar";
import useMediaQuery from "../hooks/useMediaQuery";
import { Rates } from "../models/rates";

const rates: Rates = {
  base: "EUR",
  date: "2022-11-06",
  rates: {
    AUD: 1.543764,
    CAD: 1.345729,
    CHF: 0.996466,
    CNY: 7.173202,
    DKK: 7.459992,
    GBP: 0.87748,
    HKD: 7.837216,
    JPY: 146.378799,
    NZD: 1.68541,
    SEK: 10.989902,
    SGD: 1.400492,
    USD: 0.998352,
    ZAR: 17.87424,
  },
};

const RatesPage = () => {
  const oneColumnTable = useMediaQuery("(max-width: 873px)");
  const twoColumnTable = useMediaQuery("(max-width: 1177px)");

  const renderTable = (cols: number, table: number) => {
    return (
      <SimpleDataTable
        getCellProps={(_, index) => ({ isNumeric: index % 2 === 1 })}
        headers={[["Currency", "Rate for €1"]]}
        data={Object.keys(rates.rates)
          .filter((_, i) => i % table === cols - 1)
          .map((key) => [key, rates.rates[key].toFixed(5)])}
      />
    );
  };

  return (
    <>
      <AppBar title="Current Rates" />
      <main className="layout--content rates">
        <Typography use="body1" tag="p">
          Cross rates for{" "}
          <b>{new Date(rates.date).toLocaleDateString("en-GB")}</b> with{" "}
          <b>{rates.base}</b> as a base currency.
        </Typography>

        <div className="rates--container">
          {oneColumnTable ? (
            renderTable(1, 1)
          ) : twoColumnTable ? (
            <>
              {renderTable(1, 2)}
              {renderTable(2, 2)}
            </>
          ) : (
            <>
              {renderTable(1, 3)}
              {renderTable(2, 3)}
              {renderTable(3, 3)}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default RatesPage;
