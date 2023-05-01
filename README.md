# Getting Started with payment demo app

This is a demo project created by Virendra.

### Description
This project used React js, Bootstrap and Stripe for accepting payment using cards, This can be accessed from https://react-payment-app-tau.vercel.app/. All the user related data are store in the client side only.\
Data of all pages of this app is associated on the user's email id, And it's retrieved from Stripe payment gateway APIs.\
The payment app is associated for a email, Once a new email is entered in to the payment form then this will replace the existing email on local storage.\
If you want to switch between email ids, Just init a new payment with the email you want to switch for.

### Assumption
Assuming user as authorized user, Based on the email id added. All the data associated to this email id only.\ 
Adding a fixed description for all the payment requests.\
For this demo passing env variable this can be changed to env files too.\
For now Stripe client secret keys are hard coded that also can be moved to backend or can be read from env file. In real life scenario that env file will not be in this code base.\
For this demo I have written all the payment API on client side this need to be moved to server side in real file scenario.\
For this demo I am writing test cases only for init payment page.

### Library used in this project
[![reactjs](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://react-bootstrap.github.io/)
[![stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)](https://stripe.com/en-in)


### Stripe demo card number
|Card number |Details|
|--- | --- |
|4000000000003220| 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with Out of Band UI.
|4000000000003238| 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with One Time Passcode UI.
|4000000000003246| 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with single-select UI.
|4000000000003253| 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with multi-select UI.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.\

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Checks for any linting error

### `npm run lint:fix`

Checks for any linting error and fixes them

### `npm run format`

Used for code formatting based on prettier rules
