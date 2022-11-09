# Requirements

## Description

Create a simple app to display several bank accounts and manage money transfers between them.

## Preconditions

### Bank account should have the following properties:

- Name or identifier
- Currency
- Current balance

### Main functionality:

- Choose accounts to transfer money from and to
- Enter amount to transfer
- Transfer money between accounts
- In case of different currencies, convert the amount to the currency of the account you are transferring to
- In case of insufficient funds, display an error message

### Technical requirements:

- Use React for the frontend
- Use TypeScript
- Use a simple API for the backend
- In case backend is not available, use a mock API
- No authentication and security layer is required

### UI/UX requirements:

- Use Material UI for the UI
- Use gray/green color scheme
- Desktop is the main target platform

### Acceptance criteria:

- The user should be able to run the app locally (no containers)
- User should be able to view the list of accounts
- User should be able to create a new account or edit an existing one (including the balance?)
- User should be able to transfer money between accounts (including the conversion)

### Nice to have:

- Load the current exchange rates from an API
- View the current exchange rates
- View the history of transfers
