# Test Bank Accounts app

A demo app that displays some accounts, their balances and allows you to transfer money between them.

The accounts can be in different currencies, and the app will convert the amounts to the currency
of the account you are transferring to.

## Development

It will be a React app, using standart Redux for state management.

The app will be written in TypeScript.

For the UI, I'm using Material UI for React: [RMWC](https://rmwc.io/).

For the API, I'm using [Firestore](https://firebase.google.com).

For the state management, I'm using [Rematch](https://rematchjs.org/).

For the currency conversion, I'm using [Exchange Rates API](https://exchangeratesapi.io).

## Repository

It's not a monorepo, just a container of the two packages I needed for this app: one for the API done in the format
of a Firebase Cloud Function reading and writing to a Firestore database, and one for the frontend done in React.

## Running the app

Locally, app can be run under the `test-app` folder with `npm run start`.
