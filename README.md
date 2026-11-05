# smartpay-lab

This is my personal Ethereum development project.

The project includes:
- Smart contracts
- React frontend
- Wallet integration
- Ethereum deployment

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/Jeak-200/smartpay-lab.git
cd smartpay-lab
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx smartpay-lab node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx smartpay-lab run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Coinbase Wallet](https://www.coinbase.com/wallet) or [Metamask](https://metamask.io) installed and listening to
`localhost 8545`.

- Measure your tests coverage with [solidity-coverage](https://github.com/sc-forks/solidity-coverage).

This project also includes [a sample frontend/Dapp](./frontend), which uses [Create React App](https://github.com/facebook/create-react-app).

## Troubleshooting

- `Invalid nonce` errors: if you are seeing this error on the `npx hardhat node`
  console, try resetting your Metamask account. This will reset the account's
  transaction history and also the nonce. Open Metamask, click on your account
  followed by `Settings > Advanced > Clear activity tab data`.

## Getting help and updates

If you need help with this project, Reach out to me via GitHub and I’ll get back to you.

**Happy _building_!**
# smartpay-lab

