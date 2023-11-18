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
dotenv.config();

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
  "0x2fa2441789d2e720400cc7ef63336c478fba54e18c8d830a449c9268b4ebe155";
const depositEventSchema = getEventSchema("Deposited(address,uint256)");
// !!! - this should index into deposits and find the blockheader in the struct
const senderQuery = buildReceiptSubquery(txHash)
  .log(4) // event
  .topic(1) // event schema
  .eventSchema(depositEventSchema);
console.log("Appending Receipt Subquery:", senderQuery);

query.appendDataSubquery(senderQuery);

const amountSubQuery = buildReceiptSubquery(txHash)
  .log(4) // event
  .topic(3) // to field
  .eventSchema(depositEventSchema);

console.log("Appending Receipt Subquery:", amountSubQuery);
query.appendDataSubquery(amountSubQuery);

const exampleClientAddr = "0x888d44c887DFCfaeBBf41C53eD87C0C9ED994165";
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

  // const queryId = await query.sendOnchainQuery(
  //   paymentAmt,
  //   (receipt: ethers.ContractTransactionReceipt) => {
  //     // You can do something here once you've received the receipt
  //     console.log("receipt", receipt);
  //   }
  // );
  // console.log(
  //   "View your Query on Axiom Explorer:",
  //   `https://explorer.axiom.xyz/v2/goerli/mock/query/${queryId}`
  // );
}

main();
