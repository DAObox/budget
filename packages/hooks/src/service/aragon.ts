import { Client, ContextParams, TokenVotingClient } from "@aragon/sdk-client";
import { Context, SupportedNetwork } from "@aragon/sdk-client-common";
import { Wallet } from "ethers";

const contextParams: ContextParams = {
  // Choose the network you want to use. You can use "goerli" (Ethereum) or "maticmum" (Polygon) for testing, or "mainnet" (Ethereum) and "polygon" (Polygon) for mainnet.
  network: SupportedNetwork.GOERLI,
  web3Providers: "https://eth.llamarpc.com",
  // This is the signer account who will be signing transactions for your app. You can use also use a specific account where you have funds, through passing it `new Wallet("your-wallets-private-key")` or pass it in dynamically when someone connects their wallet to your dApp.
  signer: Wallet.createRandom(),
};

const context: Context = new Context(contextParams);
export const client: Client = new Client(context);
export const tokenVotingClient: TokenVotingClient = new TokenVotingClient(context);
