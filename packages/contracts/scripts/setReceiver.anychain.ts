import { ethers } from "hardhat";

const RECEIVER = process.env.RECEIVER!;
const MSGSENDER = process.env.MSGSENDER!;

async function main() {
  if (!RECEIVER) {
    throw new Error("RECEIVER env variable not set");
  }

  if (!MSGSENDER) {
    throw new Error("MSGSENDER env variable not set");
  }
  const msgsender = await ethers.getContractAt("MsgSender", MSGSENDER);

  const tx = await msgsender.setReceiverAddress(RECEIVER);

  console.log(tx);
  await tx.wait();
  console.log("Done");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// RECEIVER=0x MSGSENDER=0x npx hardhat run --network goerli packages/contracts/scripts/setReceiver.anychain.ts
