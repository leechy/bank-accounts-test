import { useSelector } from "react-redux";
import { SimpleDataTable, Typography } from "rmwc";
import AppBar from "../components/AppBar";
import useMediaQuery from "../hooks/useMediaQuery";

import { RootState } from "../store";

const RatesPage = () => {
  // get the rates from the state
  const rates = useSelector((state: RootState) => state.rates);

  // how many tables to show depending on the screen size
  const oneColumnTable = useMediaQuery("(max-width: 873px)");
  const twoColumnTable = useMediaQuery("(max-width: 1177px)");

  const renderTable = (cols: number, table: number) => {
    return (
      <SimpleDataTable
        getCellProps={(_, index) => ({ isNumeric: index % 2 === 1 })}
        headers={[["Currency", "Rate for €1"]]}
        data={Object.keys(rates.rates)
          .sort((a, b) => a[0].localeCompare(b[0]))
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
