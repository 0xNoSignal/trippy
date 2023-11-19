import type { NextApiRequest, NextApiResponse } from "next";
import {
  Axiom,
  QueryV2,

  AxiomV2Callback,
  bytes32,
  getEventSchema,
  buildReceiptSubquery,
} from "@axiom-crypto/core";

type Data = {
  message: string;
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Extract 'hash' from query parameters
  const { hash, dest } = req.query;
  const secretKey = process.env.PRIVATE_KEY;
  const NODE_URL = process.env.ETHEREUM_GOERLI_RPC_URL;

  if (!secretKey) {
    res.status(500).json({ message: "Missing PRIVATE_KEY", success: false });
    return;
  }

  if (!dest || Array.isArray(dest)) {
    res.status(500).json({ message: "Missing destination", success: false });
    return;
  }

  if (!NODE_URL) {
    return res.status(500).json({ message: "Missing NODE_URL", success: false });
  }

  

  // Ensure 'hash' is a string
  const hashString = Array.isArray(hash) ? hash[0] : hash;

  // Use the function with 'hash' string
  const txHash = hashString ? hashString : "WRONG";
  const success = hashString ? true : false;
  if (!success) {
    return res.status(500).json({ message: "Missing hash", success: false });
  }

  const axiom = new Axiom({
    providerUri: NODE_URL,
    privateKey: secretKey,
    version: "v2",
    chainId: 5, // Goerli
    mock: true, // generate Mock proofs for faster development
  });

  const query = (axiom.query as QueryV2).new();
  const depositEventSchema = getEventSchema("Deposited(address,uint256,uint256)");
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
query.appendDataSubquery(chainIdQuery)

console.log("DEST", dest);

const exampleClientAddr = dest;
const callback: AxiomV2Callback = {
  target: exampleClientAddr,
  extraData: bytes32(0),
};
query.setCallback(callback);

if (!(await query.validate())) {
  return res.status(500).json({ message: "Query validation failed", success: false });
}

const builtQuery = await query.build();
console.log("Query built with the following params:", builtQuery);

  const paymentAmt = await query.calculateFee();
  console.log(
    "Sending a Query to AxiomV2QueryMock with payment amount (wei):",
    paymentAmt
  );
  const schemaID = query.getDataQueryHash();
  console.log(schemaID)

  const queryId = await query.sendOnchainQuery(
    paymentAmt,
    (receipt: any) => {
      // You can do something here once you've received the receipt
      console.log("receipt", receipt);
    }
  );


  // Send back the processed string
 res.status(200).json({ message: `https://explorer.axiom.xyz/v2/goerli/mock/query/${queryId}`, success });
}
