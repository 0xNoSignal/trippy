import { ethers } from "ethers";
import {
  Axiom,
  QueryV2,
  getSlotForMapping,
  buildStorageSubquery,
  StorageSubquery,
  AxiomV2Callback,
  bytes32,
  getEventSchema,
  buildReceiptSubquery,
} from "@axiom-crypto/core";
import * as dotenv from "dotenv";
dotenv.config({
  path: __dirname + "/.env",
});

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const NODE_URL = process.env.ETHEREUM_GOERLI_RPC_URL!;

if (!PRIVATE_KEY) {
  throw new Error("Missing PRIVATE_KEY");
}
if (!NODE_URL) {
  throw new Error("Missing NODE_URL");
}

const axiom = new Axiom({
  providerUri: NODE_URL,
  privateKey: PRIVATE_KEY,
  version: "v2",
  chainId: 5, // Goerli
  mock: true, // generate Mock proofs for faster development
});
const query = (axiom.query as QueryV2).new();

const txHash =
  "0xb8177c0b680374509d6bcd07a6b415c577f3c1f004c4540cbe48b2fad1eeb780";

const depositEventSchema = getEventSchema("Deposited(address,uint256,uint256)");

console.log("Deposit Event Schema:", depositEventSchema);
// !!! - this should index into deposits and find the blockheader in the struct
const senderQuery = buildReceiptSubquery(txHash)
  .log(0) // event
  .topic(1) // event sender
  .eventSchema(depositEventSchema);

console.log("Appending Receipt Subquery:", senderQuery);

query.appendDataSubquery(senderQuery);

const amountSubQuery = buildReceiptSubquery(txHash)
  .log(0) // event
  .topic(2) // amount field
  .eventSchema(depositEventSchema);

console.log("Appending Receipt Subquery:", amountSubQuery);
query.appendDataSubquery(amountSubQuery);

const chainIdQuery = buildReceiptSubquery(txHash)
  .log(0) // event
  .topic(3) // chainid field
  .eventSchema(depositEventSchema);

console.log("Appending Receipt Subquery:", chainIdQuery);
query.appendDataSubquery(chainIdQuery);

const exampleClientAddr = "0x4584B65aa36E2D45dDe5a48179745E24D50c8469";
const callback: AxiomV2Callback = {
  target: exampleClientAddr,
  extraData: bytes32(0),
};
query.setCallback(callback);

async function main() {
  if (!(await query.validate())) {
    throw new Error("Query validation failed");
  }
  const builtQuery = await query.build();
  console.log("Query built with the following params:", builtQuery);

  const paymentAmt = await query.calculateFee();
  console.log(
    "Sending a Query to AxiomV2QueryMock with payment amount (wei):",
    paymentAmt
  );

  // 0x7414b8dc240f08f8e2ae002abf72afc299dc4b0e4ab522aeb3bf0dd9c2ccb61f
  const schemaID = query.getDataQueryHash();
  console.log(schemaID);

  const queryId = await query.sendOnchainQuery(
    paymentAmt,
    (receipt: ethers.ContractTransactionReceipt) => {
      // You can do something here once you've received the receipt
      console.log("receipt", receipt);
    }
  );
  console.log(
    "View your Query on Axiom Explorer:",
    `https://explorer.axiom.xyz/v2/goerli/mock/query/${queryId}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
