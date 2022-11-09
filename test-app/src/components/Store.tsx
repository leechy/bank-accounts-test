import React, { useEffect } from "react";
import { Provider, connect } from "react-redux";
import { RootState, Dispatch, store } from "../store";

const mapState = (state: RootState) => ({
  count: state.count,
});
const mapDispatch = (dispatch: Dispatch) => ({
  increment: () => dispatch.count.increment(1),
  incrementAsync: () => dispatch.count.incrementAsync(1),
});

const StoreContainer = connect(
  mapState,
  mapDispatch
)(({ children }: any) => children);

const Store = ({ children }: React.PropsWithChildren) => {
  useEffect(() => {
    // initial data loading
    store.dispatch.accounts.getAccounts();
    store.dispatch.transactions.getTransactions();
    store.dispatch.rates.getRates();
  }, []);

  return (
    <Provider store={store}>
      <StoreContainer>{children}</StoreContainer>
    </Provider>
  );
};

export default Store;
