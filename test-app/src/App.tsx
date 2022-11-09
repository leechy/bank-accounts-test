// components
import React from "react";
import { ThemeProvider } from "rmwc";
import { Portal } from "@rmwc/base";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Store from "./components/Store";

// pages
import Page from "./components/Page";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Rates from "./pages/Rates";
import Error404 from "./pages/Error404";
import Account from "./pages/Account";

// styles
import "./App.scss";
import "rmwc/dist/styles";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Page />} errorElement={<Error404 />}>
        <Route path="accounts" element={<Accounts />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="rates" element={<Rates />} />
        <Route path="accounts/:accountId" element={<Account />} />
      </Route>
    )
  );

  return (
    <React.StrictMode>
      <Portal />
      <ThemeProvider
        options={{
          primary: "#3d3d3f",
          secondary: "#a2bd30",
          textPrimaryOnBackground: "#a2bd30",
        }}
      >
        <Store>
          <RouterProvider router={router} />
        </Store>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
